import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', withSubtitle = true }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-xs',
    md: 'w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl',
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none group shrink-0">
      <div
        className={`relative ${sizeClasses[size]} rounded-xl bg-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-105 shrink-0`}
      >
        <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-serif-luxury font-black text-cyan-300 tracking-wider">
          <span className="relative z-10">IF</span>
          <div className="absolute inset-0 bg-cyan-500/10 rounded-[10px] blur-xs group-hover:bg-cyan-500/30 transition-colors" />
        </div>
      </div>

      {withSubtitle && (
        <div className="flex flex-col justify-center leading-tight">
          <span className="font-serif-luxury text-sm sm:text-base lg:text-lg font-black tracking-wider text-stone-950 dark:text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
            ILHAM FAZRIL
          </span>
          <span className="hidden xs:inline-block sm:inline-block text-[9px] sm:text-[10px] lg:text-xs font-mono-tech tracking-widest uppercase text-cyan-600 dark:text-cyan-300 font-bold whitespace-nowrap">
            Principal Engineer
          </span>
        </div>
      )}
    </div>
  );
};
