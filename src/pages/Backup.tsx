import React, { useState, useRef } from 'react';
import { useOilStore } from '../store/oilStore';
import { usePartStore } from '../store/partStore';
import { useToastStore } from '../store/toastStore';
import { Button } from '../components/ui/Button';
import { 
  Download, 
  Upload, 
  DatabaseBackup, 
  AlertTriangle,
  RefreshCw,
  FileJson,
  CheckCircle2,
  Database
} from 'lucide-react';

export const Backup: React.FC = () => {
  // Oils
  const { records: oilRecords, restoreDatabase: restoreOilDatabase } = useOilStore();
  // Parts
  const { records: partRecords, restoreDatabase: restorePartDatabase } = usePartStore();
  
  const { showToast } = useToastStore();
  
  const oilFileInputRef = useRef<HTMLInputElement>(null);
  const partFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isValidatingOil, setIsValidatingOil] = useState(false);
  const [isValidatingPart, setIsValidatingPart] = useState(false);
  
  const [oilRestoreSummary, setOilRestoreSummary] = useState<{ fileName: string; count: number } | null>(null);
  const [partRestoreSummary, setPartRestoreSummary] = useState<{ fileName: string; count: number } | null>(null);
  
  const [tempOilRecords, setTempOilRecords] = useState<any[] | null>(null);
  const [tempPartRecords, setTempPartRecords] = useState<any[] | null>(null);

  // --- BACKUP DOWNLOAD ---
  const handleDownloadBackup = (type: 'oils' | 'parts') => {
    const records = type === 'oils' ? oilRecords : partRecords;
    const namePrefix = type === 'oils' ? 'oils' : 'parts';

    if (records.length === 0) {
      showToast('მონაცემთა ბაზა ცარიელია, ბექაპი ვერ შეიქმნება', 'error');
      return;
    }

    try {
      const backupData = {
        version: '1.0',
        type: type,
        generatedAt: new Date().toISOString(),
        recordsCount: records.length,
        data: records,
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ts_auto_${namePrefix}_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('მონაცემთა ბაზის ბექაპი წარმატებით ჩამოიტვირთა', 'success');
    } catch (e) {
      console.error(e);
      showToast('ბექაპის შექმნისას დაფიქსირდა შეცდომა', 'error');
    }
  };

  // --- RESTORE HANDLERS ---
  const handleUploadClick = (type: 'oils' | 'parts') => {
    if (type === 'oils') {
      oilFileInputRef.current?.click();
    } else {
      partFileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'oils' | 'parts') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'oils') {
      setIsValidatingOil(true);
      setOilRestoreSummary(null);
      setTempOilRecords(null);
    } else {
      setIsValidatingPart(true);
      setPartRestoreSummary(null);
      setTempPartRecords(null);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let dataToValidate: any = null;
        if (Array.isArray(parsed)) {
          dataToValidate = parsed;
        } else if (parsed && Array.isArray(parsed.data)) {
          // Check type match if it's our structured format
          if (parsed.type && parsed.type !== type) {
             throw new Error(`ეს ფაილი შეიცავს ${parsed.type === 'oils' ? 'ზეთების' : 'ნაწილების'} მონაცემებს, თქვენ კი ცდილობთ მის აღდგენას არასწორ ბაზაში.`);
          }
          dataToValidate = parsed.data;
        }

        if (!dataToValidate || dataToValidate.length === 0) {
          throw new Error('ბექაპის ფაილი არ შეიცავს ჩანაწერების მასივს');
        }

        // Basic validation of fields
        const testItem = dataToValidate[0];
        if (type === 'oils') {
          if (!testItem.code || !testItem.make || !testItem.model || !testItem.viscosity) {
            throw new Error('ბექაპის ფაილს აქვს არასწორი მონაცემთა სტრუქტურა ზეთებისთვის');
          }
          setTempOilRecords(dataToValidate);
          setOilRestoreSummary({ fileName: file.name, count: dataToValidate.length });
        } else {
          if (!testItem.code || !testItem.name || !testItem.category || testItem.price === undefined) {
            throw new Error('ბექაპის ფაილს აქვს არასწორი მონაცემთა სტრუქტურა სავალი ნაწილებისთვის');
          }
          setTempPartRecords(dataToValidate);
          setPartRestoreSummary({ fileName: file.name, count: dataToValidate.length });
        }

        showToast('ფაილი წარმატებით შემოწმდა. მზად არის აღსადგენად.', 'info');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'ფაილის პარსინგის შეცდომა. დარწმუნდით რომ ფაილი სწორი JSON-ია', 'error');
      } finally {
        if (type === 'oils') setIsValidatingOil(false);
        else setIsValidatingPart(false);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = (type: 'oils' | 'parts') => {
    try {
      if (type === 'oils' && tempOilRecords) {
        restoreOilDatabase(tempOilRecords);
        showToast(`ზეთების ბაზა წარმატებით აღდგა: ${tempOilRecords.length} ჩანაწერი ჩაიწერა`, 'success');
        setTempOilRecords(null);
        setOilRestoreSummary(null);
        if (oilFileInputRef.current) oilFileInputRef.current.value = '';
      } else if (type === 'parts' && tempPartRecords) {
        restorePartDatabase(tempPartRecords);
        showToast(`ნაწილების ბაზა წარმატებით აღდგა: ${tempPartRecords.length} ჩანაწერი ჩაიწერა`, 'success');
        setTempPartRecords(null);
        setPartRestoreSummary(null);
        if (partFileInputRef.current) partFileInputRef.current.value = '';
      }
    } catch (e) {
      console.error(e);
      showToast('ბაზის აღდგენისას დაფიქსირდა შეცდომა', 'error');
    }
  };

  const handleCancelRestore = (type: 'oils' | 'parts') => {
    if (type === 'oils') {
      setTempOilRecords(null);
      setOilRestoreSummary(null);
      if (oilFileInputRef.current) oilFileInputRef.current.value = '';
    } else {
      setTempPartRecords(null);
      setPartRestoreSummary(null);
      if (partFileInputRef.current) partFileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-10 fade-in max-w-5xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
          <span className="w-1.5 h-4.5 bg-brand-gold-500 rounded-sm inline-block"></span>
          ბექაპი და აღდგენა / Backup System
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-sans">
          მონაცემთა ბაზების სრული ექსპორტი და იმპორტი დაცული JSON ფორმატით
        </p>
      </div>

      {/* --- OILS BACKUP SECTION --- */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-2">
          <Database className="w-5 h-5 text-brand-gold-400" />
          ზეთების მონაცემთა ბაზა
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Backup */}
          <div className="glass p-6 md:p-8 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/20 flex items-center justify-center">
                <DatabaseBackup className="w-6 h-6 text-brand-gold-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">ზეთების ბექაპი</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">
                  გადმოწერეთ ზეთების ბაზის სრული ასლი.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl text-xs font-sans font-medium text-slate-400">
                ბაზაში ამჟამად არის: <span className="text-brand-gold-400 font-bold font-sans">{oilRecords.length} ჩანაწერი</span>
              </div>
            </div>
            <Button
              onClick={() => handleDownloadBackup('oils')}
              variant="glass-gold"
              className="w-full mt-6 flex items-center justify-center gap-2 font-sans py-3"
            >
              <Download className="w-4.5 h-4.5" />
              ჩამოტვირთე (JSON)
            </Button>
          </div>

          {/* Restore Backup */}
          <div className="glass p-6 md:p-8 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-brand-gold-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">მონაცემების აღდგენა</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">
                  ატვირთეთ ადრე შენახული ზეთების JSON ბექაპი.
                </p>
              </div>
              <div className="p-3.5 bg-red-950/10 border border-red-500/15 rounded-xl text-[11px] leading-relaxed text-red-400 flex items-start gap-2.5 font-sans">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span><b>ყურადღება:</b> ბექაპის აღდგენა სრულად ჩაანაცვლებს მიმდინარე მონაცემებს.</span>
              </div>
            </div>
            <input
              type="file"
              ref={oilFileInputRef}
              onChange={(e) => handleFileChange(e, 'oils')}
              accept=".json"
              className="hidden"
            />
            <Button
              onClick={() => handleUploadClick('oils')}
              variant="glass-gold"
              className="w-full mt-6 flex items-center justify-center gap-2 font-sans py-3"
              isLoading={isValidatingOil}
            >
              <FileJson className="w-4.5 h-4.5" />
              აირჩიე ფაილი
            </Button>
          </div>
        </div>

        {/* Restore summary for Oils */}
        {oilRestoreSummary && (
          <div className="glass p-6 rounded-2xl border-brand-gold-500/20 bg-brand-gold-950/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)] animate-fadeIn space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ზეთების ფაილი მზად არის აღსადგენად
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-left">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ფაილის სახელი</span>
                <span className="text-sm font-semibold text-slate-200 truncate block">{oilRestoreSummary.fileName}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-left">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ჩანაწერების რაოდენობა</span>
                <span className="text-sm font-bold text-brand-gold-400 font-sans">{oilRestoreSummary.count} ჩანაწერი</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="glass" size="sm" onClick={() => handleCancelRestore('oils')} className="font-sans">გაუქმება</Button>
              <Button variant="primary" size="sm" onClick={() => handleExecuteRestore('oils')} className="flex items-center gap-1.5 font-sans">
                <RefreshCw className="w-4 h-4" /> ბაზის აღდგენა
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* --- PARTS BACKUP SECTION --- */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-2">
          <Database className="w-5 h-5 text-brand-blue-400" />
          სავალი ნაწილების მონაცემთა ბაზა
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Backup */}
          <div className="glass p-6 md:p-8 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue-500/10 border border-brand-blue-500/20 flex items-center justify-center">
                <DatabaseBackup className="w-6 h-6 text-brand-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">ნაწილების ბექაპი</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">
                  გადმოწერეთ სავალი ნაწილების ბაზის სრული ასლი.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl text-xs font-sans font-medium text-slate-400">
                ბაზაში ამჟამად არის: <span className="text-brand-blue-400 font-bold font-sans">{partRecords.length} ჩანაწერი</span>
              </div>
            </div>
            <Button
              onClick={() => handleDownloadBackup('parts')}
              variant="glass-blue"
              className="w-full mt-6 flex items-center justify-center gap-2 font-sans py-3"
            >
              <Download className="w-4.5 h-4.5" />
              ჩამოტვირთე (JSON)
            </Button>
          </div>

          {/* Restore Backup */}
          <div className="glass p-6 md:p-8 rounded-2xl border-slate-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue-500/10 border border-brand-blue-500/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-brand-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">მონაცემების აღდგენა</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">
                  ატვირთეთ ადრე შენახული ნაწილების JSON ბექაპი.
                </p>
              </div>
              <div className="p-3.5 bg-red-950/10 border border-red-500/15 rounded-xl text-[11px] leading-relaxed text-red-400 flex items-start gap-2.5 font-sans">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span><b>ყურადღება:</b> ბექაპის აღდგენა სრულად ჩაანაცვლებს მიმდინარე მონაცემებს.</span>
              </div>
            </div>
            <input
              type="file"
              ref={partFileInputRef}
              onChange={(e) => handleFileChange(e, 'parts')}
              accept=".json"
              className="hidden"
            />
            <Button
              onClick={() => handleUploadClick('parts')}
              variant="glass-blue"
              className="w-full mt-6 flex items-center justify-center gap-2 font-sans py-3"
              isLoading={isValidatingPart}
            >
              <FileJson className="w-4.5 h-4.5" />
              აირჩიე ფაილი
            </Button>
          </div>
        </div>

        {/* Restore summary for Parts */}
        {partRestoreSummary && (
          <div className="glass p-6 rounded-2xl border-brand-blue-500/20 bg-brand-blue-950/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)] animate-fadeIn space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ნაწილების ფაილი მზად არის აღსადგენად
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-left">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ფაილის სახელი</span>
                <span className="text-sm font-semibold text-slate-200 truncate block">{partRestoreSummary.fileName}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-left">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ჩანაწერების რაოდენობა</span>
                <span className="text-sm font-bold text-brand-blue-400 font-sans">{partRestoreSummary.count} ჩანაწერი</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="glass" size="sm" onClick={() => handleCancelRestore('parts')} className="font-sans">გაუქმება</Button>
              <Button variant="secondary" size="sm" onClick={() => handleExecuteRestore('parts')} className="flex items-center gap-1.5 font-sans !bg-gradient-to-r !from-brand-blue-500 !to-brand-blue-600 !border-brand-blue-300/30 !text-white">
                <RefreshCw className="w-4 h-4" /> ბაზის აღდგენა
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export default Backup;
