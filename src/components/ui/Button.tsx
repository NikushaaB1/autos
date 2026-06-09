import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'glass-gold' | 'glass-blue' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070a13] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }[size];

  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 text-[#070a13] font-bold border border-brand-gold-300/30 focus:ring-brand-gold-400 shadow-[0_4px_20px_rgba(212,163,43,0.15)] hover:shadow-[0_4px_25px_rgba(212,163,43,0.3)]',
    
    secondary: 'bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 hover:from-brand-blue-500 hover:to-brand-blue-600 text-white font-bold border border-brand-blue-400/20 focus:ring-brand-blue-500 shadow-[0_4px_20px_rgba(56,174,249,0.15)] hover:shadow-[0_4px_25px_rgba(56,174,249,0.3)]',
    
    glass: 'glass hover:bg-white/5 text-slate-300 hover:text-white border-slate-800 focus:ring-slate-500',
    
    'glass-gold': 'glass-gold text-brand-gold-300 hover:text-brand-gold-200 hover:bg-brand-gold-500/10 focus:ring-brand-gold-400 shadow-[inset_0_0_12px_rgba(212,163,43,0.02)] hover:shadow-[0_0_20px_rgba(212,163,43,0.15)]',
    
    'glass-blue': 'glass-blue text-brand-blue-300 hover:text-brand-blue-200 hover:bg-brand-blue-500/10 focus:ring-brand-blue-500 shadow-[inset_0_0_12px_rgba(56,174,249,0.02)] hover:shadow-[0_0_20px_rgba(56,174,249,0.15)]',
    
    danger: 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/30 hover:border-red-600/50 focus:ring-red-500 shadow-[0_4px_15px_rgba(239,68,68,0.1)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.2)]',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
export default Button;
