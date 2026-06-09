import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full text-left ${containerClassName}`}>
        {label && (
          <label className="text-xs font-semibold text-slate-400 tracking-wide font-sans">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={`w-full rounded-lg text-sm bg-slate-950/60 backdrop-blur-md border transition-all duration-300 text-slate-200 appearance-none cursor-pointer pr-10 pl-4 py-2.5
              ${
                error
                  ? 'border-red-600/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                  : 'border-slate-800 focus:border-brand-blue-500/60 focus:ring-1 focus:ring-brand-blue-500/30 focus:shadow-[0_0_15px_rgba(56,174,249,0.1)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron Arrow */}
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-[11px] font-medium text-red-400 mt-0.5 ml-1 leading-none">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
