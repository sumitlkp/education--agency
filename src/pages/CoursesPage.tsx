import React, { useState, useMemo } from 'react';
import { Course } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { CourseFilters, FilterType, SortOption } from '../components/courses/CourseFilters.tsx';
import { CourseGrid } from '../components/courses/CourseGrid.tsx';
import { Search } from 'lucide-react';

interface CoursesPageProps {
  onSelectCourse: (course: Course) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  onSelectCourse,
  searchQuery,
  setSearchQuery
}) => {
  const { courses, loadingCourses, favorites } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredCourses = useMemo(() => {
    let list = [...courses];

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

    if (activeFilter === 'live') {
      list = list.filter((c) => c.type === 'live');
    } else if (activeFilter === 'recorded') {
      list = list.filter((c) => c.type === 'recorded');
    } else if (activeFilter === 'favorites') {
      list = list.filter((c) => favorites.includes(c.id));
    } else if (activeFilter === 'inactive') {
      list = list.filter((c) => c.status === 'inactive');
    }

    if (activeCategory !== 'All') {
      list = list.filter((c) => c.category === activeCategory);
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'latest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      list.sort((a, b) => (b.studentsCount ?? b.studentsEnrolled ?? 0) - (a.studentsCount ?? a.studentsEnrolled ?? 0));
    }

    return list;
  }, [courses, searchQuery, activeFilter, activeCategory, sortBy, favorites]);

  const handleReset = () => {
    setActiveFilter('all');
    setActiveCategory('All');
    setSortBy('popular');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            All StudyWay Batches
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Structured courses, high-yield practice modules, and test series for ITI & Government exams.
          </p>
        </div>

        {/* In-page search bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, trade, or teacher..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Filters & Sorters */}
      <CourseFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredCourses.length}
      />

      {/* Grid */}
      <CourseGrid
        courses={filteredCourses}
        loading={loadingCourses}
        onSelectCourse={onSelectCourse}
        onResetFilters={handleReset}
        searchQuery={searchQuery}
      />
    </div>
  );
};
