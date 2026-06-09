import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOilStore } from '../store/oilStore';
import { useToastStore } from '../store/toastStore';
import { SearchHighlight } from '../components/SearchHighlight';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  FileDown,
  Printer,
  Upload,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { OilRecord } from '../types';

export const DatabasePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    searchQuery, 
    selectedMake, 
    currentPage, 
    recordsPerPage,
    fetchRecords,
    setSearchQuery,
    setSelectedMake,
    setCurrentPage,
    getFilteredRecords,
    deleteRecord,
    importCSV
  } = useOilStore();
  
  const { showToast } = useToastStore();

  const [selectedRecord, setSelectedRecord] = useState<OilRecord | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Available brand filters
  const makes = [
    { value: null, label: 'ყველა' },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Subaru', label: 'Subaru' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Lexus', label: 'Lexus' },
    { value: 'Porsche', label: 'Porsche' },
    { value: 'სხვა', label: 'სხვა' },
  ];

  // Get current filtered records
  const filteredRecords = getFilteredRecords();
  
  // Calculate Pagination
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

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

  // --- IMPORT / EXPORT HANDLERS ---

  // Export as CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showToast('საექსპორტო მონაცემები არ არის', 'error');
      return;
    }
    
    const headers = 'ზეთის კოდი,ავტომობილის მარკა,ავტომობილის მოდელი,გამოშვების წელი,ძრავი,ზეთის ტიპი,სიბლანტე,შენიშვნა\n';
    const rows = filteredRecords.map(r => 
      `"${r.code}","${r.make}","${r.model}",${r.year},"${r.engine}","${r.oilType}","${r.viscosity}","${r.note || ''}"`
    ).join('\n');

    // Prepend UTF-8 BOM so Excel opens it with correct Georgian character formatting
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ts_auto_oils_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV ექსპორტი წარმატებით დასრულდა', 'success');
  };

  // Export as Excel (XLS) - utilizing HTML table formatting inside a downloadable XML-compliant format
  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      showToast('საექსპორტო მონაცემები არ არის', 'error');
      return;
    }

    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; }
          th { background-color: #0c4270; color: white; font-weight: bold; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>ზეთის კოდი</th>
              <th>მარკა</th>
              <th>მოდელი</th>
              <th>წელი</th>
              <th>ძრავი</th>
              <th>ზეთის ტიპი</th>
              <th>სიბლანტე</th>
              <th>შენიშვნა</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredRecords.forEach(r => {
      tableHtml += `
        <tr>
          <td>${r.code}</td>
          <td>${r.make}</td>
          <td>${r.model}</td>
          <td>${r.year}</td>
          <td>${r.engine}</td>
          <td>${r.oilType}</td>
          <td>${r.viscosity}</td>
          <td>${r.note || ''}</td>
        </tr>
      `;
    });

    tableHtml += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ts_auto_oils_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel ექსპორტი წარმატებით დასრულდა', 'success');
  };

  // Export as PDF (Generates custom print view for printing to PDF)
  const handleExportPDF = () => {
    if (filteredRecords.length === 0) {
      showToast('საექსპორტო მონაცემები არ არის', 'error');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('ფანჯრის გახსნა ვერ მოხერხდა. გამორთეთ Pop-up Blocker-ი', 'error');
      return;
    }

    const html = `
      <html>
        <head>
          <title>TS-AUTO — ზეთების მონაცემთა ბაზა</title>
          <style>
            body { font-family: 'Helvetica Neue', 'Arial', sans-serif; padding: 20px; color: #1e293b; }
            .header { display: flex; justify-between; items-center; border-bottom: 2px solid #b8861d; padding-bottom: 15px; margin-bottom: 25px; }
            .logo { font-size: 24px; font-weight: bold; color: #b8861d; }
            .slogan { font-size: 12px; color: #64748b; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th { background-color: #0f172a; color: white; font-weight: bold; padding: 10px 8px; border: 1px solid #cbd5e1; }
            td { padding: 8px; border: 1px solid #cbd5e1; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { margin-top: 30px; font-size: 9px; color: #94a3b8; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">TS-AUTO</div>
              <div class="slogan">მანქანის საუკეთესო არჩევანი</div>
            </div>
            <div style="text-align: right;">
              <div>თარიღი: ${new Date().toLocaleDateString('ka-GE')}</div>
              <div>სულ ჩანაწერები: ${filteredRecords.length}</div>
            </div>
          </div>
          <div class="title">გაფილტრული ზეთების მონაცემთა ბაზა</div>
          <table>
            <thead>
              <tr>
                <th>ზეთის კოდი</th>
                <th>მარკა</th>
                <th>მოდელი</th>
                <th>წელი</th>
                <th>ძრავი</th>
                <th>ზეთის ტიპი</th>
                <th>სიბლანტე</th>
                <th>შენიშვნა</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(r => `
                <tr>
                  <td><b>${r.code}</b></td>
                  <td>${r.make}</td>
                  <td>${r.model}</td>
                  <td>${r.year}</td>
                  <td>${r.engine}</td>
                  <td>${r.oilType}</td>
                  <td>${r.viscosity}</td>
                  <td>${r.note || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            დაგენერირებულია TS-AUTO მართვის სისტემის მიერ © ${new Date().getFullYear()}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // CSV Import File Trigger
  const handleCSVImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = importCSV(text);
      setIsImporting(false);
      
      if (res.success) {
        showToast(`CSV იმპორტი წარმატებით დასრულდა: დაემატა ${res.count} ჩანაწერი`, 'success');
      } else {
        showToast(res.error || 'ფაილის წაკითხვისას დაფიქსირდა შეცდომა', 'error');
      }
      
      // Reset input value so same file can be uploaded again
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Title + Action Buttons */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-brand-gold-500 rounded-sm inline-block"></span>
            ზეთების მონაცემთა ბაზა
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            ბაზაში ნაპოვნია <span className="text-brand-gold-400 font-bold font-sans">{totalRecords}</span> ჩანაწერი
          </p>
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* CSV Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <Button
            variant="glass"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-sans py-2"
            onClick={handleCSVImportClick}
            isLoading={isImporting}
          >
            <Upload className="w-4 h-4 text-brand-blue-400" />
            CSV იმპორტი
          </Button>

          {/* CSV Export */}
          <Button
            variant="glass"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-sans py-2"
            onClick={handleExportCSV}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            CSV ექსპორტი
          </Button>

          {/* Excel Export */}
          <Button
            variant="glass"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-sans py-2"
            onClick={handleExportExcel}
          >
            <FileDown className="w-4 h-4 text-brand-gold-400" />
            Excel ექსპორტი
          </Button>

          {/* PDF Export / Print */}
          <Button
            variant="glass"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-sans py-2"
            onClick={handleExportPDF}
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            ბეჭდვა / PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-sans py-2 xl:ml-2"
            onClick={() => navigate('/database/add')}
          >
            <Plus className="w-4 h-4" />
            დამატება
          </Button>
        </div>
      </div>

      {/* Filter Options & Search Row */}
      <div className="glass p-5 rounded-2xl border-slate-800/60 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
        
        {/* Search Bar */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="მოძებნე ზეთის კოდით, მარკით, მოდელით, ძრავით ან წლით..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-blue-500/60 focus:ring-1 focus:ring-brand-blue-500/30 rounded-xl py-2.5 pl-11 pr-10 text-xs text-slate-200 placeholder-slate-500 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-900/60"></div>

        {/* Brand Filters Badge Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            ფილტრი მარკების მიხედვით
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {makes.map((make) => {
              const isSelected = selectedMake === make.value;
              return (
                <button
                  key={make.label}
                  onClick={() => setSelectedMake(make.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer
                    ${isSelected 
                      ? 'bg-brand-gold-500/10 text-brand-gold-300 border border-brand-gold-500/40 glow-gold shadow-[inset_0_0_12px_rgba(212,163,43,0.02)]' 
                      : 'bg-slate-950/40 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                    }`}
                >
                  {make.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Database Table Container */}
      <div className="glass rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] overflow-hidden">
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
            {paginatedRecords.map((record) => (
              <Tr key={record.id}>
                {/* Search highlights applied */}
                <Td className="font-bold text-brand-gold-400 font-sans tracking-wide">
                  <SearchHighlight text={record.code} query={searchQuery} />
                </Td>
                <Td className="font-semibold text-slate-200">
                  <SearchHighlight text={record.make} query={searchQuery} />
                </Td>
                <Td className="text-slate-300">
                  <SearchHighlight text={record.model} query={searchQuery} />
                </Td>
                <Td className="hidden sm:table-cell font-sans">
                  <SearchHighlight text={record.year} query={searchQuery} />
                </Td>
                <Td className="hidden md:table-cell font-sans">
                  <SearchHighlight text={record.engine} query={searchQuery} />
                </Td>
                <Td className="hidden lg:table-cell text-slate-400">{record.oilType}</Td>
                <Td className="font-bold font-sans text-brand-blue-400">
                  <SearchHighlight text={record.viscosity} query={searchQuery} />
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue-300 hover:bg-slate-900/85 transition-colors cursor-pointer"
                      title="დეტალები"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/database/edit/${record.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-gold-300 hover:bg-slate-900/85 transition-colors cursor-pointer"
                      title="რედაქტირება"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(record.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900/85 transition-colors cursor-pointer"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
            {totalRecords === 0 && (
              <Tr>
                <Td colSpan={8} className="text-center py-12 text-slate-500 font-sans">
                  ჩანაწერები მითითებული პარამეტრებით ვერ მოიძებნა
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Pagination controls footer */}
        {totalRecords > 0 && (
          <div className="flex flex-col items-center justify-between px-4 sm:px-6 py-4 bg-slate-950/20 border-t border-slate-900 gap-3">
            {/* Info row */}
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-slate-500 font-sans">
                <span className="font-semibold text-slate-300 font-sans">{startIndex + 1}</span>–
                <span className="font-semibold text-slate-300 font-sans">
                  {Math.min(startIndex + recordsPerPage, totalRecords)}
                </span>
                {' '}/{' '}
                <span className="font-semibold text-slate-300 font-sans">{totalRecords}</span>
              </div>

              {/* Jump to page — shown when pages > 7 */}
              {totalPages > 7 && (
                <div className="flex items-center gap-1.5 text-xs font-sans text-slate-500">
                  <span className="hidden sm:inline">გვერდი</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    defaultValue={currentPage}
                    key={currentPage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt((e.target as HTMLInputElement).value);
                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                          setCurrentPage(val);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                      }
                    }}
                    className="w-14 text-center bg-slate-900/60 border border-slate-800 focus:border-brand-blue-500/60 focus:ring-1 focus:ring-brand-blue-500/30 rounded-lg py-1 px-1 text-xs text-slate-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-slate-600">/ {totalPages}</span>
                </div>
              )}
            </div>

            {/* Navigation row */}
            <div className="flex items-center gap-1 font-sans text-xs w-full justify-center">
              {/* Prev Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer mr-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Smart page numbers with ellipsis */}
              {(() => {
                const delta = 2; // neighbors on each side of current page
                const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
                
                if (totalPages <= 7) {
                  // Few pages — show all
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  const left = Math.max(2, currentPage - delta);
                  const right = Math.min(totalPages - 1, currentPage + delta);

                  pages.push(1);
                  if (left > 2) pages.push('ellipsis-start');
                  for (let i = left; i <= right; i++) pages.push(i);
                  if (right < totalPages - 1) pages.push('ellipsis-end');
                  pages.push(totalPages);
                }

                return pages.map((p, idx) => {
                  if (p === 'ellipsis-start' || p === 'ellipsis-end') {
                    return (
                      <span key={p} className="px-1.5 py-1 text-slate-600 select-none text-sm">
                        •••
                      </span>
                    );
                  }
                  const isActive = currentPage === p;
                  return (
                    <button
                      key={`page-${p}-${idx}`}
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[32px] px-2 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center
                        ${isActive
                          ? 'bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/30'
                          : 'bg-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 border border-transparent'
                        }`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer ml-1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
export default DatabasePage;
