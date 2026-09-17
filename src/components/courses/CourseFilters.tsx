import React from 'react';
import { Radio, Video, Heart, PauseCircle, Layers, ArrowUpDown } from 'lucide-react';

export type FilterType = 'all' | 'live' | 'recorded' | 'favorites' | 'inactive';
export type SortOption = 'latest' | 'popular' | 'price-low' | 'price-high' | 'rating';

interface CourseFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

const CATEGORIES = [
  'All',
  'ITI Technical',
  'Railway Exams',
  'SSC & Gov',
  'Skill Development'
];

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  activeFilter,
  onFilterChange,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Primary Type Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Batches
          </button>

          <button
            onClick={() => onFilterChange('live')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'live'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            🔴 Live
          </button>

          <button
            onClick={() => onFilterChange('recorded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'recorded'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            📹 Recorded
          </button>

          <button
            onClick={() => onFilterChange('favorites')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'favorites'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            ❤️ Favorites
          </button>

          <button
            onClick={() => onFilterChange('inactive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'inactive'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5" />
            ⏸ Inactive
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="latest">Latest Batches</option>
            <option value="rating">Top Rated (★)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeCategory === category
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <span className="text-amber-400 font-bold">{totalResults}</span> batches
        </div>
      </div>
    </div>
  );
};
