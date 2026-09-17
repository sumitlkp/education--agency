import React, { useState, useMemo } from 'react';
import { Course, Lecture } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { CoursePlayer } from '../components/player/CoursePlayer.tsx';
import {
  ChevronLeft,
  CheckCircle2,
  Lock,
  Play,
  FileText,
  Sparkles,
  BookOpen,
  Download,
  Share2,
  Award
} from 'lucide-react';

interface CoursePlayerPageProps {
  course: Course;
  initialLecture: Lecture;
  onBack: () => void;
  onOpenEnrollModal: () => void;
}

export const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({
  course,
  initialLecture,
  onBack,
  onOpenEnrollModal
}) => {
  const { isEnrolled, currentCourseProgress, updateLectureProgress, addToast } = useApp();
  const enrolled = isEnrolled(course.id);
  const [activeLecture, setActiveLecture] = useState<Lecture>(initialLecture);

  // Flatten all lectures to calculate next & prev
  const allLectures = useMemo(() => {
    return course.modules.flatMap((m) => m.lectures);
  }, [course]);

  const currentIndex = allLectures.findIndex((l) => l.id === activeLecture.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLectures.length - 1;

  const progress = currentCourseProgress[course.id];
  const completedIds = progress?.completedLectures || [];
  const isLectureCompleted = completedIds.includes(activeLecture.id);
  const progressPercent = progress ? progress.progressPercentage : 0;

  const handlePrevious = () => {
    if (hasPrevious) {
      setActiveLecture(allLectures[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setActiveLecture(allLectures[currentIndex + 1]);
    }
  };

  const handleToggleComplete = () => {
    updateLectureProgress(course.id, activeLecture.id, !isLectureCompleted);
    addToast(
      !isLectureCompleted ? 'Marked lecture as completed! 🎉' : 'Lecture marked as uncompleted',
      'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course Overview</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white truncate max-w-xs">{course.title}</div>
            <div className="text-[11px] text-amber-400 font-semibold">{progressPercent}% Completed</div>
          </div>
          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Player on left (8 cols), Module curriculum on right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Player + Lecture Details */}
        <div className="lg:col-span-8 space-y-5">
          <CoursePlayer
            lecture={activeLecture}
            courseTitle={course.title}
            isEnrolled={enrolled}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onUpdateProgress={(lecId, comp, time) => updateLectureProgress(course.id, lecId, comp, time)}
            onOpenEnrollModal={onOpenEnrollModal}
          />

          {/* Lecture title & Actions Row */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Current Lesson
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  {activeLecture.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Duration: {activeLecture.duration} • Instructor: {course.instructor.name}
                </p>
              </div>

              {/* Mark as Completed Button */}
              {enrolled && (
                <button
                  onClick={handleToggleComplete}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isLectureCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLectureCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                </button>
              )}
            </div>

            {/* Quick Study Aids */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Have a doubt on this topic?</span>
                <span className="text-amber-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ask AI Tutor (Bottom Right)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {course.notes.length > 0 && (
                  <button
                    onClick={() => {
                      if (!enrolled) {
                        onOpenEnrollModal();
                      } else {
                        window.open(course.notes[0].fileUrl, '_blank');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 border border-slate-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Lecture Notes</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Course Curriculum Drawer */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col h-[650px]">
          {/* Header */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> Course Curriculum
            </h3>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>{completedIds.length} / {allLectures.length} Lectures Done</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Module list with scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {course.modules.map((module) => (
              <div key={module.id} className="p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Module {module.order}: {module.title}
                </div>

                <div className="space-y-1 mt-1">
                  {module.lectures.map((lec) => {
                    const isActive = lec.id === activeLecture.id;
                    const isDone = completedIds.includes(lec.id);
                    const canPlay = lec.isFreePreview || enrolled;

                    return (
                      <button
                        key={lec.id}
                        onClick={() => {
                          if (canPlay) {
                            setActiveLecture(lec);
                          } else {
                            onOpenEnrollModal();
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-amber-500/20 text-white border border-amber-500/40 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : canPlay ? (
                            <Play className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{lec.title}</span>
                        </div>

                        <span className="text-[10px] text-slate-400 shrink-0">
                          {lec.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
