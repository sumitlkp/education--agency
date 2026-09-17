import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Course } from '../types.ts';
import { CourseGrid } from '../components/courses/CourseGrid.tsx';
import { Heart, BookOpen, ArrowRight } from 'lucide-react';

interface FavoritesPageProps {
  onSelectCourse: (course: Course) => void;
  navigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectCourse,
  navigate
}) => {
  const { courses, favorites, loadingCourses } = useApp();

  const favoriteCourses = courses.filter((c) => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            Personal Bookmarks
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Your Favorite Batches
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quickly access your saved courses, target exam syllabus, and upcoming batches.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          {favoriteCourses.length} Batches Saved
        </div>
      </div>

      {favoriteCourses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
          <p className="text-sm text-slate-400 mb-6">
            Tap the heart icon on any batch card to save it here for fast access later.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Explore All Batches
          </button>
        </div>
      ) : (
        <CourseGrid
          courses={favoriteCourses}
          loading={loadingCourses}
          onSelectCourse={onSelectCourse}
          onResetFilters={() => {}}
        />
      )}
    </div>
  );
};
