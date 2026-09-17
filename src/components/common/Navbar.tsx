import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  Search,
  Heart,
  Radio,
  BookOpen,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Award,
  Bell,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  searchQuery,
  setSearchQuery,
  onOpenAuthModal
}) => {
  const { user, logout, favorites, activeLiveClasses, notifications, markNotificationRead } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const hasLiveNow = activeLiveClasses.some((l) => l.isLiveNow);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPath !== '/courses') {
      navigate('/courses');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div onClick={() => navigate('/')} className="shrink-0">
          <Logo size="md" />
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, batches (e.g. Electrician, Railway, Maths)..."
              className="w-full pl-10 pr-10 py-2 bg-slate-900/90 border border-slate-700/60 rounded-full text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Right: Desktop Navigation Links & Auth */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentPath === '/' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => navigate('/courses')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath === '/courses' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            Batches
          </button>

          <button
            onClick={() => navigate('/live')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath === '/live' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {hasLiveNow && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${hasLiveNow ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className={hasLiveNow ? 'text-rose-400 font-semibold' : ''}>Live</span>
          </button>

          <button
            onClick={() => navigate('/favorites')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
              currentPath === '/favorites' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Your Favorites"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-400 fill-rose-500/20' : 'text-slate-400'}`} />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#0b0f19]"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm text-white">Notifications</span>
                  </div>
                  <span className="text-xs text-slate-400">{unreadNotifs} unread</span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No notifications yet</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) navigate(notif.link);
                          setNotificationsOpen(false);
                        }}
                        className={`py-2.5 px-2 hover:bg-slate-800/60 rounded-lg cursor-pointer transition-colors ${
                          !notif.read ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-slate-200">{notif.title}</span>
                          <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-800 mx-1"></div>

          {/* User Auth or Profile Button */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all text-sm"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500/40"
                />
                <span className="font-medium text-slate-200 max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    Admin
                  </span>
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold text-amber-400">
                      {user.role === 'admin' ? 'Administrator' : 'Verified Student'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5"
                    >
                      <UserIcon className="w-4 h-4 text-amber-400" />
                      Student Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate('/my-courses');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5"
                    >
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      My Enrolled Courses
                    </button>

                    <button
                      onClick={() => {
                        navigate('/certificates');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      My Certificates
                    </button>

                    <button
                      onClick={() => {
                        navigate('/orders');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5"
                    >
                      <ShoppingBag className="w-4 h-4 text-purple-400" />
                      Purchase History
                    </button>

                    {/* Admin Switch */}
                    <div className="my-1 border-t border-slate-800"></div>

                    <button
                      onClick={() => {
                        navigate('/admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-purple-300 hover:text-purple-200 hover:bg-purple-950/40 flex items-center gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      Admin Control Panel
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800/60 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              Login / Register
            </button>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50"
            aria-label="Toggle mobile search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchVisible && (
        <div className="px-4 py-2.5 border-t border-slate-800 md:hidden bg-slate-900/95 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, batches..."
              className="w-full pl-10 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                Clear
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            {user ? (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/50"
                />
                <div>
                  <div className="font-semibold text-white text-sm">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-sm flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Login / Register
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('/courses');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              All Batches
            </button>
            <button
              onClick={() => {
                navigate('/live');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-rose-400" />
              Live Classes
            </button>
            <button
              onClick={() => {
                navigate('/favorites');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              Favorites ({favorites.length})
            </button>
            {user && (
              <>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/my-courses');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  My Courses
                </button>
                <button
                  onClick={() => {
                    navigate('/certificates');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-800/60 text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  Certificates
                </button>
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-purple-950/40 text-purple-300 text-left font-medium hover:bg-purple-900/50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Admin Panel
                </button>
              </>
            )}
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-rose-400 hover:bg-slate-800/50 text-sm font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
