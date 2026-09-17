import React from 'react';
import { Course } from '../../types.ts';
import { CourseCard } from './CourseCard.tsx';
import { SearchX, RotateCcw } from 'lucide-react';

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
  onSelectCourse: (course: Course) => void;
  onResetFilters: () => void;
  searchQuery?: string;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  loading,
  onSelectCourse,
  onResetFilters,
  searchQuery
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 animate-pulse flex flex-col space-y-3"
          >
            <div className="aspect-video bg-slate-800 rounded-xl w-full" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-800 rounded w-full mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
          <SearchX className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
        <p className="text-sm text-slate-400 mb-6">
          {searchQuery
            ? `We couldn't find any batches matching "${searchQuery}". Try another keyword or reset filters.`
            : 'No batches match the selected filters. Please adjust your criteria.'}
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onSelect={onSelectCourse}
        />
      ))}
    </div>
  );
};
