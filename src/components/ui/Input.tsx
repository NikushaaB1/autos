import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', containerClassName = '', type = 'text', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full text-left ${containerClassName}`}>
        {label && (
          <label className="text-xs font-semibold text-slate-400 tracking-wide font-sans">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full rounded-lg text-sm bg-slate-950/60 backdrop-blur-md border transition-all duration-300 text-slate-100 placeholder-slate-500
              ${icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5
              ${
                error
                  ? 'border-red-600/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                  : 'border-slate-800 focus:border-brand-blue-500/60 focus:ring-1 focus:ring-brand-blue-500/30 focus:shadow-[0_0_15px_rgba(56,174,249,0.1)]'
              }
              disabled:opacity-50 disabled:bg-slate-950/40 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          />
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

Input.displayName = 'Input';
export default Input;
