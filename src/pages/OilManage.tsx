import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOilStore } from '../store/oilStore';
import { useToastStore } from '../store/toastStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export const OilManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { records, addRecord, updateRecord, fetchRecords } = useOilStore();
  const { showToast } = useToastStore();

  // Form State
  const [code, setCode] = useState('');
  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [engine, setEngine] = useState('');
  const [oilType, setOilType] = useState('სინთეტიკური');
  const [viscosity, setViscosity] = useState('5W-30');
  const [note, setNote] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [customViscosity, setCustomViscosity] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Load record if in edit mode
  useEffect(() => {
    if (isEditMode && records.length > 0) {
      const record = records.find((r) => r.id === id);
      if (record) {
        setCode(record.code);
        
        const standardMakes = [
          'Mercedes-Benz',
          'BMW',
          'Audi',
          'Volkswagen',
          'Subaru',
          'Toyota',
          'Lexus',
          'Porsche',
        ];
        if (standardMakes.includes(record.make)) {
          setMake(record.make);
          setCustomMake('');
        } else {
          setMake('სხვა');
          setCustomMake(record.make);
        }

        setModel(record.model);
        setYear(record.year.toString());
        setEngine(record.engine);
        setOilType(record.oilType);

        const standardViscosities = [
          '0W-16', '0W-20', '0W-30', '0W-40', 
          '5W-20', '5W-30', '5W-40', 
          '10W-40', '10W-60', '15W-40'
        ];
        if (standardViscosities.includes(record.viscosity)) {
          setViscosity(record.viscosity);
          setCustomViscosity('');
        } else {
          setViscosity('სხვა');
          setCustomViscosity(record.viscosity);
        }

        setNote(record.note);
      } else {
        showToast('ჩანაწერი ვერ მოიძებნა', 'error');
        navigate('/database');
      }
    }
  }, [isEditMode, id, records, navigate, showToast]);

  const makesOptions = [
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Subaru', label: 'Subaru' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Lexus', label: 'Lexus' },
    { value: 'Porsche', label: 'Porsche' },
    { value: 'სხვა', label: 'სხვა (ჩაწერეთ ხელით)' },
  ];

  const viscosityOptions = [
    { value: '0W-16', label: '0W-16' },
    { value: '0W-20', label: '0W-20' },
    { value: '0W-30', label: '0W-30' },
    { value: '0W-40', label: '0W-40' },
    { value: '5W-20', label: '5W-20' },
    { value: '5W-30', label: '5W-30' },
    { value: '5W-40', label: '5W-40' },
    { value: '10W-40', label: '10W-40' },
    { value: '10W-60', label: '10W-60' },
    { value: '15W-40', label: '15W-40' },
    { value: 'სხვა', label: 'სხვა (ჩაწერეთ ხელით)' },
  ];

  const oilTypeOptions = [
    { value: 'სინთეტიკური', label: 'სინთეტიკური (Full Synthetic)' },
    { value: 'ნახევრად სინთეტიკური', label: 'ნახევრად სინთეტიკური (Semi-Synthetic)' },
    { value: 'მინერალური', label: 'მინერალური (Mineral)' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = 'ზეთის კოდი აუცილებელია';
    }
    if (make === 'სხვა' && !customMake.trim()) {
      newErrors.customMake = 'მიუთითეთ ავტომობილის მარკა';
    }
    if (!model.trim()) {
      newErrors.model = 'მოდელი აუცილებელია';
    }
    
    const numYear = parseInt(year);
    if (!year || isNaN(numYear) || numYear < 1950 || numYear > new Date().getFullYear() + 2) {
      newErrors.year = 'მიუთითეთ რეალური გამოშვების წელი (1950-დან)';
    }

    if (!engine.trim()) {
      newErrors.engine = 'ძრავი აუცილებელია (მაგ: 2.0 Turbo, 3.0d)';
    }

    if (viscosity === 'სხვა' && !customViscosity.trim()) {
      newErrors.customViscosity = 'მიუთითეთ სიბლანტის ტიპი';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('გთხოვთ შეავსოთ სავალდებულო ველები', 'error');
      return;
    }

    const finalMake = make === 'სხვა' ? customMake.trim() : make;
    const finalViscosity = viscosity === 'სხვა' ? customViscosity.trim() : viscosity;

    const data = {
      code: code.trim(),
      make: finalMake,
      model: model.trim(),
      year: parseInt(year),
      engine: engine.trim(),
      oilType,
      viscosity: finalViscosity,
      note: note.trim(),
    };

    if (isEditMode && id) {
      updateRecord(id, data);
      showToast('ჩანაწერი წარმატებით განახლდა', 'success');
    } else {
      addRecord(data);
      showToast('ახალი ჩანაწერი წარმატებით დაემატა', 'success');
    }

    navigate('/database');
  };

  return (
    <div className="space-y-6 fade-in max-w-3xl mx-auto">
      
      {/* Header back button link */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/database')}
          className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-100">
            {isEditMode ? 'ჩანაწერის რედაქტირება' : 'ახალი ჩანაწერის დამატება'}
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            შეავსეთ მონაცემები ზეთის ბაზის განახლებისთვის
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Form Card */}
      <div className="glass p-6 md:p-8 rounded-2xl border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-gold-500/20 to-transparent"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Oil Code Field */}
            <Input
              label="ზეთის კოდი *"
              placeholder="მაგ: HU918/5X"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
            />

            {/* Car Make Dropdown */}
            <Select
              label="ავტომობილის მარკა *"
              options={makesOptions}
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />

            {/* Custom Make Text input if "სხვა" selected */}
            {make === 'სხვა' && (
              <Input
                label="მიუთითეთ მარკა ხელით *"
                placeholder="მაგ: Honda, Opel, Nissan"
                value={customMake}
                onChange={(e) => setCustomMake(e.target.value)}
                error={errors.customMake}
                containerClassName="md:col-span-2"
              />
            )}

            {/* Model Field */}
            <Input
              label="ავტომობილის მოდელი *"
              placeholder="მაგ: C-Class, Forester, X5"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              error={errors.model}
            />

            {/* Release Year Field */}
            <Input
              label="გამოშვების წელი *"
              type="number"
              placeholder="მაგ: 2015"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              error={errors.year}
            />

            {/* Engine Field */}
            <Input
              label="ძრავი *"
              placeholder="მაგ: 2.0 Turbo, 3.0d V6"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              error={errors.engine}
            />

            {/* Oil Type Selector */}
            <Select
              label="ზეთის ტიპი *"
              options={oilTypeOptions}
              value={oilType}
              onChange={(e) => setOilType(e.target.value)}
            />

            {/* Viscosity Dropdown */}
            <Select
              label="სიბლანტე (Viscosity) *"
              options={viscosityOptions}
              value={viscosity}
              onChange={(e) => setViscosity(e.target.value)}
            />

            {/* Custom Viscosity Input if "სხვა" selected */}
            {viscosity === 'სხვა' && (
              <Input
                label="მიუთითეთ სიბლანტის რეიტინგი *"
                placeholder="მაგ: 10W-50, 75W-90"
                value={customViscosity}
                onChange={(e) => setCustomViscosity(e.target.value)}
                error={errors.customViscosity}
                containerClassName="md:col-span-2"
              />
            )}
          </div>

          {/* Note Area */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-slate-400 tracking-wide font-sans">
              შენიშვნა
            </label>
            <textarea
              placeholder="მაგ: BMW LL-04 დაშვება, მოყვება სალონის ფილტრიც..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-lg text-sm bg-slate-950/60 backdrop-blur-md border border-slate-800 focus:border-brand-blue-500/60 focus:ring-1 focus:ring-brand-blue-500/30 text-slate-200 placeholder-slate-500 p-4 transition-all duration-300 font-sans leading-relaxed"
            />
          </div>

          {/* Action Footer Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-900 pt-6">
            <Button
              type="button"
              variant="glass"
              onClick={() => navigate('/database')}
              className="font-sans"
            >
              გაუქმება
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2 font-sans"
            >
              {isEditMode ? (
                <>
                  <Save className="w-4.5 h-4.5" />
                  შენახვა
                </>
              ) : (
                <>
                  <Plus className="w-4.5 h-4.5" />
                  დამატება
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};
export default OilManage;
