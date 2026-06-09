import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePartStore } from '../store/partStore';
import { useToastStore } from '../store/toastStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export const PartManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { records, addRecord, updateRecord, fetchRecords } = usePartStore();
  const { showToast } = useToastStore();

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ამორტიზატორი');
  const [make, setMake] = useState('Mercedes-Benz');
  const [customMake, setCustomMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('0');
  const [supplier, setSupplier] = useState('');
  const [note, setNote] = useState('');

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
        setName(record.name);
        setCategory(record.category);
        
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
        setQuantity(record.quantity.toString());
        setPrice(record.price.toString());
        setSupplier(record.supplier);
        setNote(record.note);
      } else {
        showToast('ჩანაწერი ვერ მოიძებნა', 'error');
        navigate('/parts');
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

  const categoryOptions = [
    { value: 'ამორტიზატორი', label: 'ამორტიზატორი' },
    { value: 'საკიდარი', label: 'საკიდარი (სავალი ნაწილები)' },
    { value: 'სამუხრუჭე სისტემა', label: 'სამუხრუჭე სისტემა' },
    { value: 'საჭის სისტემა', label: 'საჭის სისტემა' },
    { value: 'ტრანსმისია', label: 'ტრანსმისია (გადაცემათა კოლოფი/ხიდი)' },
    { value: 'ძრავის ნაწილები', label: 'ძრავის ნაწილები' },
    { value: 'საკისარი', label: 'საკისარი (პაჩევნიკი)' },
    { value: 'სხვა', label: 'სხვა' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = 'კოდი აუცილებელია';
    }
    if (!name.trim()) {
      newErrors.name = 'დასახელება აუცილებელია';
    }
    if (make === 'სხვა' && !customMake.trim()) {
      newErrors.customMake = 'მიუთითეთ ავტომობილის მარკა';
    }
    if (!model.trim()) {
      newErrors.model = 'მოდელი აუცილებელია';
    }
    
    const numYear = parseInt(year);
    if (!year || isNaN(numYear) || numYear < 1950 || numYear > new Date().getFullYear() + 2) {
      newErrors.year = 'მიუთითეთ რეალური გამოშვების წელი';
    }

    const numQty = parseInt(quantity);
    if (isNaN(numQty) || numQty < 0) {
      newErrors.quantity = 'მიუთითეთ რაოდენობა';
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      newErrors.price = 'მიუთითეთ სწორი ფასი';
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

    const data = {
      code: code.trim(),
      name: name.trim(),
      category,
      make: finalMake,
      model: model.trim(),
      year: parseInt(year),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      supplier: supplier.trim(),
      note: note.trim(),
    };

    if (isEditMode && id) {
      updateRecord(id, data);
      showToast('ჩანაწერი წარმატებით განახლდა', 'success');
    } else {
      addRecord(data);
      showToast('ახალი ჩანაწერი წარმატებით დაემატა', 'success');
    }

    navigate('/parts');
  };

  return (
    <div className="space-y-6 fade-in max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/parts')}
          className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-brand-blue-500 rounded-sm inline-block"></span>
            {isEditMode ? 'ნაწილის რედაქტირება' : 'ახალი ნაწილის დამატება'}
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            შეავსეთ მონაცემები სავალი ნაწილების ბაზის განახლებისთვის
          </p>
        </div>
      </div>

      <div className="glass p-6 md:p-8 rounded-2xl border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-blue-500/20 to-transparent"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Part Code */}
            <Input
              label="ნაწილის კოდი (SKU) *"
              placeholder="მაგ: SK-001, 1K0 407 151 AM"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
            />

            {/* Part Name */}
            <Input
              label="დასახელება *"
              placeholder="მაგ: წინა ამორტიზატორი"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            {/* Category Dropdown */}
            <Select
              label="კატეგორია *"
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            {/* Car Make Dropdown */}
            <Select
              label="ავტომობილის მარკა *"
              options={makesOptions}
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />

            {/* Custom Make Input */}
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

            {/* Quantity Field */}
            <Input
              label="რაოდენობა *"
              type="number"
              min="0"
              placeholder="მაგ: 2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={errors.quantity}
            />

            {/* Price Field */}
            <Input
              label="ფასი (₾) *"
              type="number"
              min="0"
              step="0.01"
              placeholder="მაგ: 150.50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
            />

            {/* Supplier Field */}
            <Input
              label="მომწოდებელი"
              placeholder="მაგ: AutoParts GE"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              containerClassName="md:col-span-2"
            />
          </div>

          {/* Note Area */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-slate-400 tracking-wide font-sans">
              შენიშვნა
            </label>
            <textarea
              placeholder="მაგ: ორიგინალი ნაწილი, მოყვება გარანტია..."
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
              onClick={() => navigate('/parts')}
              className="font-sans"
            >
              გაუქმება
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2 font-sans !bg-gradient-to-r !from-brand-blue-500 !to-brand-blue-600 !border-brand-blue-300/30 !text-white"
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
export default PartManage;
