import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = true }) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5 select-none cursor-pointer group">
      {/* Original Professional EdTech Emblem */}
      <div className={`relative ${iconSize} flex items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 text-white"
        >
          {/* Graduation cap top */}
          <path
            d="M18 4L3 12L18 20L33 12L18 4Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          {/* Tassel */}
          <path
            d="M30 14V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Open pages / stepping stone forward */}
          <path
            d="M9 16.5V24C9 27 18 30 18 30C18 30 27 27 27 24V16.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Indian tricolor accent spark */}
          <circle cx="18" cy="12" r="1.8" fill="#FF9933" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-white font-['Outfit',sans-serif] ${titleSize}`}>
            Study<span className="text-amber-400">Way</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            India
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:block">
            सफलता का मार्ग • Learn Today • Succeed Tomorrow
          </span>
        )}
      </div>
    </div>
  );
};
