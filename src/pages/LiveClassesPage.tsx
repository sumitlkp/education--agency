import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LiveClass, Course } from '../types.ts';
import { Radio, Clock, User, Calendar, ExternalLink, ShieldCheck, Video, ArrowRight } from 'lucide-react';

interface LiveClassesPageProps {
  onSelectCourse: (course: Course) => void;
  onOpenCheckout: (course: Course) => void;
}

export const LiveClassesPage: React.FC<LiveClassesPageProps> = ({
  onSelectCourse,
  onOpenCheckout
}) => {
  const { activeLiveClasses, courses, isEnrolled, addToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'live-now' | 'upcoming'>('all');

  const filtered = activeLiveClasses.filter((c) => {
    if (filter === 'live-now') return c.isLiveNow;
    if (filter === 'upcoming') return !c.isLiveNow;
    return true;
  });

  const handleJoin = (liveClass: LiveClass) => {
    const course = courses.find((c) => c.id === liveClass.courseId);
    if (!course) return;

    if (!isEnrolled(course.id)) {
      addToast('Live class access requires enrollment in the batch.', 'warning');
      onOpenCheckout(course);
      return;
    }

    window.open(liveClass.meetingUrl || 'https://meet.google.com', '_blank');
    addToast(`Joining live stream for ${liveClass.topic || liveClass.title || 'Live Class'}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Real-time Learning Room
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            StudyWay Daily Live Classes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Interact live with top ITI trade masters & competitive exam educators. Solve doubts in real-time.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Scheduled ({activeLiveClasses.length})
          </button>
          <button
            onClick={() => setFilter('live-now')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              filter === 'live-now' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            Live Now
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'upcoming' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Reassurance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Video className="w-4 h-4 text-amber-400" />
          <span>Missed a live class? Recorded replays are automatically archived within 2 hours with timestamped notes.</span>
        </div>
      </div>

      {/* Grid of Live Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const course = courses.find((c) => c.id === item.courseId);
          const enrolled = course ? isEnrolled(course.id) : false;

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                item.isLiveNow
                  ? 'bg-gradient-to-b from-rose-950/20 to-slate-900/90 border-rose-500/40 shadow-xl shadow-rose-950/20'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                    {item.batchName}
                  </span>
                  {item.isLiveNow ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Scheduled
                    </span>
                  )}
                </div>

                {/* Topic */}
                <h3 className="text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>

                {/* Schedule & Teacher */}
                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold">{item.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Educator: <strong>{item.instructorName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
                {course && (
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    View Batch Details
                  </button>
                )}

                <button
                  onClick={() => handleJoin(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    item.isLiveNow
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{item.isLiveNow ? (enrolled ? 'Enter Live Room' : 'Enroll to Join') : 'Join Link'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
