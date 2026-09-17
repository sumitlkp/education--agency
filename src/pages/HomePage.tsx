import React, { useState, useMemo } from 'react';
import { Course } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { CourseFilters, FilterType, SortOption } from '../components/courses/CourseFilters.tsx';
import { CourseGrid } from '../components/courses/CourseGrid.tsx';
import {
  Sparkles,
  Radio,
  BookOpen,
  Video,
  Heart,
  CheckCircle2,
  Users,
  Award,
  Zap,
  TrendingUp,
  FileText,
  MessageSquare,
  ShieldCheck,
  PlayCircle,
  ArrowRight,
  Star
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  searchQuery,
  setSearchQuery,
  onSelectCourse
}) => {
  const { courses, loadingCourses, favorites, activeLiveClasses } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (activeFilter === 'live') {
      list = list.filter((c) => c.type === 'live');
    } else if (activeFilter === 'recorded') {
      list = list.filter((c) => c.type === 'recorded');
    } else if (activeFilter === 'favorites') {
      list = list.filter((c) => favorites.includes(c.id));
    } else if (activeFilter === 'inactive') {
      list = list.filter((c) => c.status === 'inactive');
    }

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((c) => c.category === activeCategory);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'latest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // popular
      list.sort((a, b) => b.studentsCount - a.studentsCount);
    }

    return list;
  }, [courses, searchQuery, activeFilter, activeCategory, sortBy, favorites]);

  const handleResetFilters = () => {
    setActiveFilter('all');
    setActiveCategory('All');
    setSortBy('popular');
    setSearchQuery('');
  };

  const liveClassesNow = activeLiveClasses.filter((c) => c.isLiveNow);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-amber-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>StudyWay India • 2026 Batch Admissions Open</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Hindi + English</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif] leading-[1.15]">
            Learn. Practice. <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Achieve.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Live and recorded courses, study material and structured learning — all in one place. Trusted by thousands of ITI, Railway & competitive exam aspirants across India.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('batches-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/live')}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-md transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Live Classes</span>
            </button>
          </div>

          {/* Quick Nav Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => {
                setActiveFilter('all');
                document.getElementById('batches-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Batches</span>
            </button>
            <button
              onClick={() => navigate('/live')}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-rose-500" />
              <span>🔴 Live</span>
            </button>
            <button
              onClick={() => {
                setActiveFilter('recorded');
                document.getElementById('batches-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-blue-400" />
              <span>📹 Recorded</span>
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>❤️ Favorites ({favorites.length})</span>
            </button>
          </div>

          {/* Trust Metric Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">50,000+</div>
                <div className="text-xs text-slate-400">Enrolled Students</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">94.2%</div>
                <div className="text-xs text-slate-400">Selection Rate</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">NCVT Pattern</div>
                <div className="text-xs text-slate-400">ITI & Railway Standard</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">Bilingual</div>
                <div className="text-xs text-slate-400">Hindi + English Hinglish</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Now Alert Ribbon (if live classes are happening) */}
      {liveClassesNow.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  🔴 LIVE CLASS IN PROGRESS: {liveClassesNow[0].title}
                </h4>
                <p className="text-xs text-slate-400">
                  Instructor: {liveClassesNow[0].instructorName} • Batch: {liveClassesNow[0].batchName}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/live')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Join Class Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Batches & Courses Section */}
      <section id="batches-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Curated Exam Batches
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Our Batches & Specialized Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              NCVT & NIMI syllabus mapped video lectures, solved papers, and handwritten notes.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <CourseFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredCourses.length}
        />

        {/* Course Cards Grid */}
        <CourseGrid
          courses={filteredCourses}
          loading={loadingCourses}
          onSelectCourse={onSelectCourse}
          onResetFilters={handleResetFilters}
          searchQuery={searchQuery}
        />
      </section>

      {/* 4. Why StudyWay India Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Why 50,000+ Indian Aspirants Choose StudyWay
            </h3>
            <p className="text-sm text-slate-400">
              Specially engineered for students aiming for government jobs, technical trades, and ITI certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Handwritten Chapter Notes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Downloadable PDF notes prepared by top educators with solved numerical formulas, diagrams, and memory charts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Live Doubt Clearing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Attend interactive live question sessions twice a week. Ask questions directly and solve previous year exam papers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">AI Study Assistant</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant 24/7 AI tutor powered by Gemini to break down difficult concepts into simple Hinglish whenever you get stuck.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Student Selection Hall of Fame */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Proven Results
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Selection Wall of Fame
          </h3>
          <p className="text-sm text-slate-400">
            Real feedback from students who achieved their dreams with StudyWay India batches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "Er. Ramesh Sir's ITI Electrician batch cleared all my fundamental doubts on AC circuits and transformer windings. I secured Rank 14 in the state electricity board exam!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                alt="Rajesh Meena"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500"
              />
              <div>
                <h5 className="font-bold text-white text-xs">Rajesh Meena</h5>
                <p className="text-[11px] text-amber-400">Selected in UP Power Corp</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "The RRB ALP Science & Technical Trade module was spot on. Every numerical formula was solved step-by-step. Passed CBT 1 and CBT 2 with flying colors!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Sunil Verma"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500"
              />
              <div>
                <h5 className="font-bold text-white text-xs">Sunil Verma</h5>
                <p className="text-[11px] text-amber-400">Railway ALP Qualified</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "Pooja Ma'am's SSC calculation shortcuts cut down my solving time by half. The handwritten formula sheets alone are worth ten times the course price."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Priyanka Kumari"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500"
              />
              <div>
                <h5 className="font-bold text-white text-xs">Priyanka Kumari</h5>
                <p className="text-[11px] text-amber-400">SSC CGL Tier-1 Cleared</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
