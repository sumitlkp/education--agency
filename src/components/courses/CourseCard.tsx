import React from 'react';
import { Course } from '../../types.ts';
import { useApp } from '../../context/AppContext.tsx';
import {
  Heart,
  Video,
  FileText,
  Clock,
  Star,
  Play,
  CheckCircle2,
  Radio,
  ArrowRight
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  const { isFavorite, toggleFavorite, isEnrolled, currentCourseProgress } = useApp();
  const favorite = isFavorite(course.id);
  const enrolled = isEnrolled(course.id);
  const progress = currentCourseProgress[course.id];
  const progressPct = progress ? progress.progressPercentage : 0;

  const discountPercent = Math.round(
    ((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100
  );

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onSelect(course)}>
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Live vs Recorded Badge */}
          {course.type === 'live' ? (
            <span className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              🔴 Live Batch
            </span>
          ) : (
            <span className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-sm">
              <Video className="w-3.5 h-3.5 text-blue-400" />
              📹 Recorded
            </span>
          )}

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(course.id);
            }}
            className="pointer-events-auto p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition-transform active:scale-90"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorite ? 'text-rose-500 fill-rose-500' : 'text-slate-300 hover:text-rose-400'
              }`}
            />
          </button>
        </div>

        {/* Category Pill on bottom of thumbnail */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
            {course.category}
          </span>
          {course.badgeText && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-500/40">
              {course.badgeText}
            </span>
          )}
        </div>
      </div>

      {/* Course Info Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title */}
        <h3
          onClick={() => onSelect(course)}
          className="font-bold text-slate-100 text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer mb-2"
        >
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2.5 mb-3">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
          />
          <div className="text-xs text-slate-300 truncate font-medium">
            {course.instructor.name}
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
            <span className="text-[11px] text-slate-500">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Meta Specs: Videos, Notes, Duration */}
        <div className="grid grid-cols-3 gap-1 py-2 px-2.5 mb-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 text-center">
          <div className="flex items-center justify-center gap-1">
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium text-slate-300">{course.totalVideos} Videos</span>
          </div>
          <div className="flex items-center justify-center gap-1 border-x border-slate-800">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-slate-300">{course.totalNotes} Notes</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300">{course.duration}</span>
          </div>
        </div>

        {/* Enrolled Progress Bar (If Enrolled) */}
        {enrolled && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Student
              </span>
              <span className="font-bold text-amber-300">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Price & Actions Row */}
        <div className="mt-auto pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white">
                ₹{course.discountedPrice}
              </span>
              <span className="text-xs text-slate-500 line-through">
                ₹{course.originalPrice}
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {course.validityMonths} Months Validity
            </div>
          </div>

          <button
            onClick={() => onSelect(course)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
              enrolled
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
            }`}
          >
            <span>{enrolled ? 'Continue' : 'View Course'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
