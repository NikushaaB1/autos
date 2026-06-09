import React, { useEffect } from 'react';
import { useOilStore } from '../store/oilStore';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import { 
  TrendingUp, 
  Droplet, 
  Car, 
  Award
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { fetchRecords, getStats, records } = useOilStore();

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const stats = getStats();

  // 1. Compute oil codes by popularity (how many vehicle records share this code)
  const codeCounts: Record<string, { count: number; make: string; viscosity: string; type: string }> = {};
  
  records.forEach((r) => {
    if (!codeCounts[r.code]) {
      codeCounts[r.code] = { count: 0, make: r.make, viscosity: r.viscosity, type: r.oilType };
    }
    codeCounts[r.code].count++;
  });

  const popularCodes = Object.keys(codeCounts)
    .map((code) => ({
      code,
      ...codeCounts[code],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // --- SVG Dimensions for Curved Addition Line Chart ---
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 30;
  
  const history = stats.historyStats || [];
  const maxVal = Math.max(5, ...history.map((h) => h.count));
  
  // Plot coordinates
  const points = history.map((h, i) => {
    const x = padding + (i * (svgWidth - padding * 2)) / (history.length - 1 || 1);
    const y = svgHeight - padding - (h.count * (svgHeight - padding * 2)) / maxVal;
    return { x, y, ...h };
  });

  // Generate Bezier Curve Path for smooth line
  let bezierPath = '';
  if (points.length > 0) {
    bezierPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      bezierPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  const areaPath = points.length > 0
    ? `${bezierPath} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
    : '';

  // --- SVG Dimensions for Viscosity Vertical Bar Chart ---
  const barSvgWidth = 600;
  const barSvgHeight = 200;
  const barPaddingLeft = 40;
  const barPaddingBottom = 30;
  const barPaddingTop = 20;

  const topViscos = stats.topViscosities.slice(0, 6);
  const maxBarVal = Math.max(5, ...topViscos.map((v) => v.count));
  const barCount = topViscos.length;
  const barWidth = 40;
  const gap = (barSvgWidth - barPaddingLeft - barWidth * barCount) / (barCount || 1);

  return (
    <div className="space-y-8 fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
          <span className="w-1.5 h-4.5 bg-brand-gold-500 rounded-sm inline-block"></span>
          სისტემის ანალიტიკა
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-sans">
          მონაცემთა ბაზის დეტალური სტატისტიკური ანალიზი
        </p>
      </div>

      {/* Grid: Weekly additions + Viscosity breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Curved Area Trend Chart */}
        <div className="glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col">
          <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-gold-400" />
            დამატების ტენდენცია (გლუვი ხაზი)
          </h3>
          <div className="flex-1 w-full min-h-[200px] flex items-center justify-center relative select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="smoothArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38AEF9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38AEF9" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="smoothLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38AEF9" />
                  <stop offset="100%" stopColor="#F3C623" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#1e293b" strokeWidth="1" />
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1={padding} y1={(svgHeight) / 2} x2={svgWidth - padding} y2={(svgHeight) / 2} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

              {/* Curve Fill Area */}
              {areaPath && <path d={areaPath} fill="url(#smoothArea)" />}

              {/* Curve Stroke Line */}
              {bezierPath && <path d={bezierPath} fill="none" stroke="url(#smoothLine)" strokeWidth="3" />}

              {/* Coordinates points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#070a13"
                    stroke="#38AEF9"
                    strokeWidth="2.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    className="text-[9px] font-bold font-sans"
                  >
                    {p.count}
                  </text>
                  <text
                    x={p.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    fill="#64748b"
                    className="text-[9px] font-bold font-sans"
                  >
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Viscosity Bar Chart */}
        <div className="glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col">
          <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-brand-blue-400" />
            პოპულარული სიბლანტის რეიტინგი
          </h3>
          <div className="flex-1 w-full min-h-[200px] flex items-center justify-center relative select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${barSvgWidth} ${barSvgHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F3C623" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={barPaddingLeft} y1={barSvgHeight - barPaddingBottom} x2={barSvgWidth - 10} y2={barSvgHeight - barPaddingBottom} stroke="#1e293b" strokeWidth="1" />

              {/* Render Bars */}
              {topViscos.map((v, i) => {
                const x = barPaddingLeft + gap / 2 + i * (barWidth + gap);
                const height = ((barSvgHeight - barPaddingBottom - barPaddingTop) * v.count) / maxBarVal;
                const y = barSvgHeight - barPaddingBottom - height;

                return (
                  <g key={v.viscosity}>
                    {/* Glowing Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(2, height)}
                      fill="url(#barGrad)"
                      rx="4"
                      className="transition-all duration-300 hover:opacity-85"
                    />
                    {/* Value label on top of bar */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      className="text-[10px] font-bold font-sans"
                    >
                      {v.count}
                    </text>
                    {/* Bottom viscosity title */}
                    <text
                      x={x + barWidth / 2}
                      y={barSvgHeight - 12}
                      textAnchor="middle"
                      fill="#64748b"
                      className="text-[9px] font-bold font-sans"
                    >
                      {v.viscosity}
                    </text>
                  </g>
                );
              })}
              {topViscos.length === 0 && (
                <text x={barSvgWidth/2} y={barSvgHeight/2} textAnchor="middle" fill="#64748b" className="text-xs">
                  მონაცემები არ არის
                </text>
              )}
            </svg>
          </div>
        </div>

      </div>

      {/* Grid: Popular Oil Codes + Brand Share details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Popular Oil Codes Table */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
          <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-brand-gold-400" />
            ყველაზე ხშირად გამოყენებული ზეთები (ტოპ 5 კოდი)
          </h3>
          <Table>
            <Thead>
              <Tr>
                <Th>კოდი</Th>
                <Th>მარკა (ნიმუში)</Th>
                <Th>ზეთის ტიპი</Th>
                <Th>სიბლანტე</Th>
                <Th className="text-right">გამოყენების სიხშირე</Th>
              </Tr>
            </Thead>
            <Tbody>
              {popularCodes.map((item) => (
                <Tr key={item.code}>
                  <Td className="font-bold text-brand-gold-400 font-sans tracking-wide">{item.code}</Td>
                  <Td className="font-semibold text-slate-200">{item.make}</Td>
                  <Td className="text-slate-400 text-xs">{item.type}</Td>
                  <Td className="font-bold font-sans text-brand-blue-400">{item.viscosity}</Td>
                  <Td className="text-right font-sans">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/20 text-xs font-bold font-sans">
                      {item.count} მანქანა
                    </span>
                  </Td>
                </Tr>
              ))}
              {popularCodes.length === 0 && (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-slate-500">
                    მონაცემები არ არის
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </div>

        {/* Right Col: Brand Share Details Breakdown */}
        <div className="glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col">
          <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
            <Car className="w-4.5 h-4.5 text-brand-blue-400" />
            მარკების დეტალური განაწილება
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {stats.makeDistribution.map((brand, idx) => (
              <div key={brand.make} className="flex items-center justify-between py-2 border-b border-slate-900/60 last:border-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${idx % 2 === 0 ? 'bg-brand-gold-500 shadow-[0_0_8px_rgba(212,163,43,0.5)]' : 'bg-brand-blue-500 shadow-[0_0_8px_rgba(56,174,249,0.5)]'}`}></span>
                  <span className="text-xs font-bold text-slate-200">{brand.make}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-sans">{brand.count} ჩანაწერი</span>
                  <span className="text-xs font-black text-brand-gold-400 font-sans w-10 text-right">{brand.percentage}%</span>
                </div>
              </div>
            ))}
            {stats.makeDistribution.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-12">მონაცემები არ არის</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Analytics;
