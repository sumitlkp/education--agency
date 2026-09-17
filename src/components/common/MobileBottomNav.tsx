import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Home, BookOpen, Radio, Heart, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenAuthModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  navigate,
  onOpenAuthModal
}) => {
  const { user, favorites, activeLiveClasses } = useApp();
  const hasLive = activeLiveClasses.some((l) => l.isLiveNow);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0b0f19]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          currentPath === '/' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px] font-medium mt-0.5">Home</span>
      </button>

      <button
        onClick={() => navigate('/courses')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          currentPath === '/courses' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[11px] font-medium mt-0.5">Courses</span>
      </button>

      <button
        onClick={() => navigate('/live')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors relative ${
          currentPath === '/live' ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Radio className="w-5 h-5 text-rose-500" />
          {hasLive && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </div>
        <span className="text-[11px] font-medium mt-0.5">Live</span>
      </button>

      <button
        onClick={() => navigate('/favorites')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors relative ${
          currentPath === '/favorites' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-400' : ''}`} />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-rose-500 text-white">
              {favorites.length}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium mt-0.5">Favorites</span>
      </button>

      <button
        onClick={() => {
          if (user) {
            navigate('/dashboard');
          } else {
            onOpenAuthModal();
          }
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          currentPath === '/dashboard' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[11px] font-medium mt-0.5">{user ? 'Profile' : 'Login'}</span>
      </button>
    </nav>
  );
};
