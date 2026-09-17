import React, { useState } from 'react';
import { Course, Lecture, CourseModule, CourseNote, LiveClass } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import {
  Heart,
  Share2,
  Video,
  FileText,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  Lock,
  Play,
  Download,
  Eye,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface CourseDetailsPageProps {
  course: Course;
  onBack: () => void;
  onOpenPlayer: (course: Course, lecture: Lecture) => void;
  onOpenCheckout: (course: Course) => void;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  course,
  onBack,
  onOpenPlayer,
  onOpenCheckout
}) => {
  const { isFavorite, toggleFavorite, isEnrolled, addToast, verifyAccess } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'notes' | 'live'>('overview');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true
  });

  const enrolled = isEnrolled(course.id);
  const favorite = isFavorite(course.id);

  const discountPercent = Math.round(
    ((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100
  );

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Course link copied to clipboard!', 'success');
  };

  const handleLectureClick = async (lecture: Lecture) => {
    if (lecture.isFreePreview || enrolled) {
      onOpenPlayer(course, lecture);
    } else {
      addToast('This lecture is locked. Please enroll in this batch to unlock all content.', 'warning');
      onOpenCheckout(course);
    }
  };

  const handleNoteAction = async (note: CourseNote) => {
    if (!note.isFree && !enrolled) {
      addToast('This study material is reserved for enrolled students. Enroll now to download.', 'warning');
      onOpenCheckout(course);
      return;
    }
    // Simulate real PDF view/download in new window
    window.open(note.fileUrl, '_blank');
    addToast(`Opening ${note.title} (${note.fileSize})`, 'info');
  };

  const handleJoinLive = (liveClass: LiveClass) => {
    if (!enrolled) {
      addToast('Live interactive classes are for enrolled students. Enroll now to join.', 'warning');
      onOpenCheckout(course);
      return;
    }
    window.open(liveClass.meetingUrl || 'https://meet.google.com', '_blank');
    addToast(`Connecting to ${liveClass.topic || liveClass.title || 'Live Room'}...`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={onBack} className="hover:text-white transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-white transition-colors">
          Batches
        </button>
        <span>/</span>
        <span className="text-amber-400 font-medium truncate max-w-md">{course.title}</span>
      </div>

      {/* Top Banner Section: Left Media, Right Purchase Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media & Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40" />

            {/* Play trailer button */}
            <button
              onClick={() => {
                const firstFree = course.modules[0]?.lectures.find((l) => l.isFreePreview) || course.modules[0]?.lectures[0];
                if (firstFree) {
                  onOpenPlayer(course, firstFree);
                }
              }}
              className="absolute inset-0 flex items-center justify-center group/btn"
              aria-label="Play free preview"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover/btn:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-slate-950 translate-x-0.5" />
              </div>
            </button>

            {/* Badges on video */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {course.category}
              </span>
              {course.type === 'live' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Live Interactive
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950/90 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                  Recorded Masterclass
                </span>
              )}
            </div>
          </div>

          {/* Quick Buttons below media */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(course.id)}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                favorite
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{favorite ? 'In Favorites' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Guarantee & Reassurance Box */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Course Activation Upon Payment</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Verified Certificate of Completion Included</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Direct Doubt Clearing with {course.instructor.name}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Instructor, Pricing & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {course.language}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300">
                NCVT / Exam Mapped
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Instructor & Rating strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <div>
                <div className="font-bold text-white text-sm">{course.instructor.name}</div>
                <div className="text-xs text-slate-400">{course.instructor.title}</div>
                <div className="text-[11px] text-amber-400 font-medium">{course.instructor.experience}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-base">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="text-xs text-slate-400">{course.reviewsCount} Student Reviews</div>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <div className="font-bold text-white text-base">{(course.studentsCount ?? course.studentsEnrolled ?? 0).toLocaleString()}</div>
                <div className="text-xs text-slate-400">Aspirants Enrolled</div>
              </div>
            </div>
          </div>

          {/* Meta Specifications */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <Video className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">{course.totalVideos} Video Lectures</div>
              <div className="text-[10px] text-slate-400">High Definition</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <FileText className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">{course.totalNotes} Study Notes</div>
              <div className="text-[10px] text-slate-400">Downloadable PDFs</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">{course.validityMonths} Months</div>
              <div className="text-[10px] text-slate-400">Full Course Validity</div>
            </div>
          </div>

          {/* Pricing & Main Action */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  ₹{course.discountedPrice}
                </span>
                <span className="text-base text-slate-500 line-through">
                  ₹{course.originalPrice}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {discountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                One-time payment • All video modules, notes & test series included
              </p>
            </div>

            <div className="w-full sm:w-auto">
              {enrolled ? (
                <button
                  onClick={() => {
                    const firstLecture = course.modules[0]?.lectures[0];
                    if (firstLecture) onOpenPlayer(course, firstLecture);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Continue Learning</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenCheckout(course)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Enroll in Batch (₹{course.discountedPrice})</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Dynamic Tabs Section */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        {/* Tabs navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Lectures & Curriculum ({course.totalVideos})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Study Notes & PDFs ({course.totalNotes})</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'live'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-400" />
            <span>Live Class & Timetable</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* What you'll learn */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white font-['Outfit']">What You Will Master in This Course</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white">Prerequisites & Target Audience</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {course.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 h-fit">
              <h3 className="text-base font-bold text-white">Lead Instructor</h3>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{course.instructor.name}</h4>
                  <p className="text-xs text-amber-400 font-medium">{course.instructor.title}</p>
                  <p className="text-[11px] text-slate-400">{course.instructor.experience}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                {course.instructor.bio}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Videos (Module Accordions) */}
        {activeTab === 'videos' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
              <span>{course.modules.length} Modules • {course.totalVideos} Lectures Total</span>
              <button
                onClick={() => {
                  const allExpanded = Object.keys(expandedModules).length === course.modules.length;
                  if (allExpanded) {
                    setExpandedModules({});
                  } else {
                    const all: Record<string, boolean> = {};
                    course.modules.forEach((m) => (all[m.id] = true));
                    setExpandedModules(all);
                  }
                }}
                className="text-amber-400 font-semibold hover:underline"
              >
                Expand / Collapse All
              </button>
            </div>

            {course.modules.map((module) => {
              const isOpen = !!expandedModules[module.id];
              return (
                <div
                  key={module.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
                >
                  {/* Accordion header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                        M{module.order}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{module.title}</h4>
                        <p className="text-xs text-slate-400">{module.lectures.length} Lectures</p>
                      </div>
                    </div>
                    <div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </button>

                  {/* Lectures list */}
                  {isOpen && (
                    <div className="divide-y divide-slate-800/60 border-t border-slate-800/60 bg-slate-950/40">
                      {module.lectures.map((lecture) => {
                        const canAccess = lecture.isFreePreview || enrolled;
                        return (
                          <div
                            key={lecture.id}
                            onClick={() => handleLectureClick(lecture)}
                            className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${canAccess ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 bg-slate-900'}`}>
                                {canAccess ? <Play className="w-4 h-4 fill-current" /> : <Lock className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                                  <span>{lecture.title}</span>
                                  {lecture.isFreePreview && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                      FREE PREVIEW
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  {lecture.duration} • Available in {lecture.availableQualities.join(', ')}
                                </div>
                              </div>
                            </div>

                            <button className="text-xs font-bold text-amber-400 hover:text-amber-300">
                              {canAccess ? 'Watch Now' : 'Unlock'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Notes & PDFs */}
        {activeTab === 'notes' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Handwritten notes, solved problem sets, and previous year exam questions.
              </span>
              {!enrolled && (
                <span className="font-bold text-amber-400 underline cursor-pointer" onClick={() => onOpenCheckout(course)}>
                  Enroll to unlock all
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.notes.map((note) => {
                const canAccess = note.isFree || enrolled;
                return (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        canAccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {canAccess ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{note.title}</h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {note.chapter} • {note.fileSize}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleNoteAction(note)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          canAccess
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                        }`}
                      >
                        {canAccess ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{canAccess ? 'Open' : 'Unlock'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Live & Timetable */}
        {activeTab === 'live' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 shrink-0" />
              <span>
                Live interactive classes are streamed weekly. Recordings are uploaded within 2 hours after every live class.
              </span>
            </div>

            <div className="space-y-3">
              {course.timetable.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                        {item.day}
                      </span>
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {item.time}
                      </span>
                      {item.isLiveNow && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                          🔴 LIVE NOW
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.topic}</h4>
                    <p className="text-xs text-slate-400">Instructor: {item.instructor}</p>
                  </div>

                  <button
                    onClick={() =>
                      handleJoinLive({
                        id: item.id,
                        courseId: course.id,
                        batchName: course.title,
                        topic: item.topic,
                        title: item.topic,
                        instructorName: item.instructor,
                        scheduledTime: `${item.day}, ${item.time}`,
                        isLiveNow: !!item.isLiveNow,
                        meetingUrl: 'https://meet.google.com'
                      })
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                      item.isLiveNow
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{item.isLiveNow ? 'Join Live Now' : 'Class Link'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
