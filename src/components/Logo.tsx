import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const dimensions = {
    sm: { svg: 'w-10 h-10', textTitle: 'text-lg', textSub: 'text-[9px]' },
    md: { svg: 'w-14 h-14', textTitle: 'text-2xl', textSub: 'text-[11px]' },
    lg: { svg: 'w-24 h-24', textTitle: 'text-4xl', textSub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium Automotive Shield + Car Silhouette SVG */}
      <svg
        className={`${dimensions.svg} shrink-0 animate-float`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3C623" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6F14" />
          </linearGradient>
          {/* Blue Gradient */}
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          {/* Metallic Dark Shield Interior */}
          <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          {/* Border Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Glowing Shield Border */}
        <path
          d="M50 5 L88 23 C88 56 68 85 50 95 C32 85 12 56 12 23 L50 5 Z"
          fill="url(#shieldBg)"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          filter="url(#glow)"
        />

        {/* Inner Shield Lining */}
        <path
          d="M50 11 L81 26 C81 51 65 77 50 86 C35 77 19 51 19 26 L50 11 Z"
          stroke="url(#blueGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.8"
        />

        {/* Automotive Car Silhouette */}
        {/* Sleek roofline, hood, rear spoiler, wheels line */}
        <path
          d="M28 55 
             C30 52, 38 43, 44 42 
             C50 41, 58 35, 66 38
             C72 40, 77 47, 79 50
             L82 52
             C82 52, 85 55, 78 55
             C75 55, 74 58, 72 58
             C70 58, 68 55, 62 55
             C56 55, 54 58, 52 58
             C50 58, 48 55, 34 55
             C30 55, 27 55, 28 55 Z"
          fill="url(#goldGrad)"
        />

        {/* Wheel Arches & Underglow */}
        <circle cx="38" cy="56" r="3.5" fill="#070a13" stroke="url(#blueGrad)" strokeWidth="1.5" />
        <circle cx="67" cy="56" r="3.5" fill="#070a13" stroke="url(#blueGrad)" strokeWidth="1.5" />
        
        {/* Glowing Headlight Line */}
        <path d="M75 51 L80 52" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Brand Name & Slogan */}
      {showText && (
        <div className="flex flex-col tracking-wide text-left">
          <div className={`${dimensions.textTitle} font-heading font-black leading-none flex items-center`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 font-extrabold">
              TS
            </span>
            <span className="text-slate-400 mx-1 font-light">|</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-300 to-brand-blue-500 font-bold">
              AUTO
            </span>
          </div>
          <span className={`${dimensions.textSub} text-brand-gold-300/80 font-medium tracking-widest mt-1 font-sans`}>
            მანქანის საუკეთესო არჩევანი
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
