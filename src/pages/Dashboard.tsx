import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOilStore } from '../store/oilStore';
import { useToastStore } from '../store/toastStore';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import { 
  Database, 
  Car, 
  Droplet, 
  TrendingUp, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import type { OilRecord } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { fetchRecords, getStats, deleteRecord, setSearchQuery } = useOilStore();
  const { showToast } = useToastStore();
  
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<OilRecord | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const stats = getStats();

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setSearchQuery(quickSearch.trim());
      navigate('/database');
    }
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (recordToDelete) {
      deleteRecord(recordToDelete);
      showToast('ჩანაწერი წარმატებით წაიშალა', 'success');
      setIsDeleteOpen(false);
      setRecordToDelete(null);
    }
  };

  // SVG dimensions for custom Weekly additions chart
  const svgWidth = 500;
  const svgHeight = 160;
  const padding = 30;
  
  // Calculate SVG path points based on history stats
  const history = stats.historyStats || [];
  const maxVal = Math.max(5, ...history.map(h => h.count));
  const points = history.map((h, i) => {
    const x = padding + (i * (svgWidth - padding * 2)) / (history.length - 1 || 1);
    const y = svgHeight - padding - (h.count * (svgHeight - padding * 2)) / maxVal;
    return { x, y, ...h };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
    : '';

  return (
    <div className="space-y-8 fade-in">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-gold rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-gold-500/5 to-transparent pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-100 leading-tight">
            მოგესალმებით, <span className="text-brand-gold-400">TS-AUTO</span>-ს მართვის პანელში!
          </h1>
          <p className="text-slate-400 text-xs font-semibold font-sans mt-1">
            აქ შეგიძლიათ მართოთ ზეთების მონაცემთა ბაზა, ნახოთ სტატისტიკა და მოახდინოთ მონაცემების ექსპორტი.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shrink-0 font-sans"
          onClick={() => navigate('/database/add')}
        >
          <Plus className="w-4.5 h-4.5" />
          ჩანაწერის დამატება
        </Button>
      </div>

      {/* Grid of Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Records Widget */}
        <div className="glass p-5 rounded-2xl border-slate-800/60 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
              სულ ჩანაწერები
            </span>
            <span className="text-3xl font-black font-heading text-slate-100 block">
              {stats.totalRecords}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/20 flex items-center justify-center">
            <Database className="w-6 h-6 text-brand-gold-400" />
          </div>
        </div>

        {/* Total Brands Widget */}
        <div className="glass p-5 rounded-2xl border-slate-800/60 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
              მარკები (ბრენდები)
            </span>
            <span className="text-3xl font-black font-heading text-slate-100 block">
              {stats.brandsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-blue-500/10 border border-brand-blue-500/20 flex items-center justify-center">
            <Car className="w-6 h-6 text-brand-blue-400" />
          </div>
        </div>

        {/* Viscosity Ratings Widget */}
        <div className="glass p-5 rounded-2xl border-slate-800/60 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
              სიბლანტის ტიპები
            </span>
            <span className="text-3xl font-black font-heading text-slate-100 block">
              {stats.viscositiesCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Droplet className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Trending Widget */}
        <div className="glass p-5 rounded-2xl border-slate-800/60 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
              პოპულარული
            </span>
            <span className="text-lg font-black font-heading text-brand-gold-300 block leading-tight truncate max-w-[150px]">
              {stats.topViscosities[0]?.viscosity || '-'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Charts & Quick search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Quick Search + Custom Weekly Graph */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Quick Search Card */}
          <div className="glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
            <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-brand-gold-500 rounded-sm inline-block"></span>
              სწრაფი ძებნა
            </h3>
            <form onSubmit={handleQuickSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="შეიყვანეთ ზეთის კოდი, მარკა, მოდელი, ძრავი ან წელი..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-blue-500/60 focus:ring-1 focus:ring-brand-blue-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 transition-all duration-300"
                />
              </div>
              <Button type="submit" variant="secondary" className="font-sans">
                მოძებნე
              </Button>
            </form>
          </div>

          {/* Custom Weekly Trend Chart Card */}
          <div className="glass p-6 rounded-2xl border-slate-800/60 flex-1 flex flex-col shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
            <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-brand-blue-500 rounded-sm inline-block"></span>
              დამატებების დინამიკა (ბოლო 7 დღე)
            </h3>
            
            {/* Render Custom responsive SVG line chart */}
            <div className="flex-1 w-full min-h-[160px] flex items-center justify-center relative select-none">
              <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                <defs>
                  {/* Fill Gradient */}
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F3C623" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F3C623" stopOpacity="0.00" />
                  </linearGradient>
                  {/* Stroke Gradient */}
                  <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38AEF9" />
                    <stop offset="50%" stopColor="#F3C623" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#1e293b" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={padding} y1={(svgHeight) / 2} x2={svgWidth - padding} y2={(svgHeight) / 2} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                {/* Path Fill Area */}
                {areaD && <path d={areaD} fill="url(#chartFill)" />}
                
                {/* Main Stroke Line */}
                {pathD && <path d={pathD} fill="none" stroke="url(#chartStroke)" strokeWidth="3" strokeLinecap="round" />}

                {/* Circular Points and Tooltips */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#070a13"
                      stroke="#F3C623"
                      strokeWidth="2.5"
                    />
                    {/* Numbers text above coordinates */}
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      className="text-[10px] font-bold font-sans"
                    >
                      {p.count}
                    </text>
                    {/* Bottom Date labels */}
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

        </div>

        {/* Right Col: Brand Distribution */}
        <div className="glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col">
          <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-brand-gold-500 rounded-sm inline-block"></span>
            მარკების წილი ბაზაში
          </h3>

          <div className="flex-1 space-y-4.5 overflow-y-auto pr-1">
            {stats.makeDistribution.slice(0, 5).map((brand, idx) => (
              <div key={brand.make} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{brand.make}</span>
                  <span className="text-brand-gold-300 font-sans">{brand.count} ჩანაწერი ({brand.percentage}%)</span>
                </div>
                {/* Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800/40">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      idx === 0 
                        ? 'bg-gradient-to-r from-brand-gold-500 to-brand-gold-600' 
                        : 'bg-gradient-to-r from-brand-blue-500 to-brand-blue-600'
                    }`}
                    style={{ width: `${brand.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {stats.makeDistribution.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-10">მონაცემები არ არის</div>
            )}
          </div>

          <div className="border-t border-slate-900/60 mt-5 pt-4">
            <button
              onClick={() => navigate('/analytics')}
              className="w-full flex items-center justify-between text-xs font-bold text-brand-blue-400 hover:text-brand-blue-300 transition-colors group cursor-pointer"
            >
              <span>სრული ანალიტიკის ნახვა</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent additions Table */}
      <div className="glass p-6 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-brand-gold-400" />
            ბოლო დამატებული ჩანაწერები
          </h3>
          <button
            onClick={() => navigate('/database')}
            className="flex items-center gap-1 text-xs font-bold text-brand-blue-400 hover:text-brand-blue-300 transition-colors group cursor-pointer"
          >
            <span>ყველას ნახვა</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <Table>
          <Thead>
            <Tr>
              <Th>ზეთის კოდი</Th>
              <Th>ავტომობილის მარკა</Th>
              <Th>მოდელი</Th>
              <Th className="hidden sm:table-cell">წელი</Th>
              <Th className="hidden md:table-cell">ძრავი</Th>
              <Th className="hidden lg:table-cell">ზეთის ტიპი</Th>
              <Th>სიბლანტე</Th>
              <Th className="text-right">მოქმედება</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.recentRecords.map((record) => (
              <Tr key={record.id}>
                <Td className="font-bold text-brand-gold-400 font-sans tracking-wide">{record.code}</Td>
                <Td className="font-semibold text-slate-200">{record.make}</Td>
                <Td className="text-slate-300">{record.model}</Td>
                <Td className="hidden sm:table-cell font-sans">{record.year}</Td>
                <Td className="hidden md:table-cell font-sans">{record.engine}</Td>
                <Td className="hidden lg:table-cell">{record.oilType}</Td>
                <Td className="font-bold font-sans text-brand-blue-400">{record.viscosity}</Td>
                <Td className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue-300 hover:bg-slate-900/80 transition-colors cursor-pointer"
                      title="დეტალები"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/database/edit/${record.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-gold-300 hover:bg-slate-900/80 transition-colors cursor-pointer"
                      title="რედაქტირება"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(record.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900/80 transition-colors cursor-pointer"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
            {stats.recentRecords.length === 0 && (
              <Tr>
                <Td colSpan={8} className="text-center py-8 text-slate-500">
                  მონაცემთა ბაზა ცარიელია
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>

      {/* --- MODALS --- */}
      
      {/* Details View Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="ჩანაწერის დეტალები"
        size="md"
      >
        {selectedRecord && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ზეთის კოდი</span>
                <span className="text-lg font-bold text-brand-gold-400 font-sans">{selectedRecord.code}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">სიბლანტე (Viscosity)</span>
                <span className="text-lg font-bold text-brand-blue-400 font-sans">{selectedRecord.viscosity}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ავტომობილის მარკა</span>
                <span className="text-base font-bold text-slate-200">{selectedRecord.make}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">მოდელი</span>
                <span className="text-base font-bold text-slate-200">{selectedRecord.model}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">გამოშვების წელი</span>
                <span className="text-base font-bold text-slate-200 font-sans">{selectedRecord.year}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ძრავი</span>
                <span className="text-base font-bold text-slate-200 font-sans">{selectedRecord.engine}</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 col-span-2">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ზეთის ტიპი</span>
                <span className="text-sm font-semibold text-slate-300">{selectedRecord.oilType}</span>
              </div>
            </div>
            
            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mb-1">შენიშვნა</span>
              <span className="text-sm text-slate-300 font-sans leading-relaxed">
                {selectedRecord.note || <span className="italic text-slate-600">შენიშვნა არ არის</span>}
              </span>
            </div>

            <div className="text-[10px] text-slate-500 text-right font-sans">
              დამატების თარიღი: {new Date(selectedRecord.dateAdded).toLocaleString('ka-GE')}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-900 pt-4">
              <Button
                variant="glass"
                size="sm"
                onClick={() => setSelectedRecord(null)}
              >
                დახურვა
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const id = selectedRecord.id;
                  setSelectedRecord(null);
                  navigate(`/database/edit/${id}`);
                }}
              >
                რედაქტირება
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="ჩანაწერის წაშლა"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            ნამდვილად გსურთ ამ ჩანაწერის წაშლა მონაცემთა ბაზიდან? ამ მოქმედების გაუქმება შეუძლებელია.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
            >
              გაუქმება
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              წაშლა
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
export default Dashboard;
