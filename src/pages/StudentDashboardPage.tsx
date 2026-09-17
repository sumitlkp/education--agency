import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Course, Certificate } from '../types.ts';
import { CertificateModal } from '../components/certificate/CertificateModal.tsx';
import {
  User,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  Radio,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface StudentDashboardPageProps {
  onSelectCourse: (course: Course) => void;
  onOpenPlayer: (course: Course, lecture: any) => void;
  navigate: (path: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onSelectCourse,
  onOpenPlayer,
  navigate
}) => {
  const { user, courses, enrollments, currentCourseProgress, certificates } = useApp();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 px-4">
        <h2 className="text-2xl font-bold text-white">Student Login Required</h2>
        <p className="text-slate-400 text-sm">Please sign in to view your learning progress and enrolled courses.</p>
      </div>
    );
  }

  // Calculate enrolled courses
  const enrolledCourses = courses.filter((c) =>
    enrollments.some((e) => e.courseId === c.id)
  );

  // Pick first enrolled course as "Continue Learning" hero
  const primaryCourse = enrolledCourses[0] || courses[0];
  const primaryProgress = primaryCourse ? currentCourseProgress[primaryCourse.id] : null;
  const primaryPct = primaryProgress ? primaryProgress.progressPercentage : 0;

  // Calculate total completed lectures across courses
  const totalCompletedLectures = Object.values(currentCourseProgress).reduce(
    (acc: number, p: any) => acc + (p?.completedLectures ? p.completedLectures.length : 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                Welcome back, {user.name} 👋
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Preparation Target: <strong className="text-slate-200">ITI Technical & Railway ALP 2026</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/certificates')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>My Certificates ({certificates.length})</span>
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 transition-colors shadow-md shadow-amber-500/20"
          >
            Browse New Batches
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white">{enrolledCourses.length}</div>
          <div className="text-xs text-slate-400">Enrolled Batches</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalCompletedLectures}</div>
          <div className="text-xs text-slate-400">Lectures Completed</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white">48.5 hrs</div>
          <div className="text-xs text-slate-400">Total Learning Hours</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white">{certificates.length}</div>
          <div className="text-xs text-slate-400">Verified Credentials</div>
        </div>
      </div>

      {/* Continue Learning Hero Card */}
      {primaryCourse && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={primaryCourse.thumbnail}
              alt={primaryCourse.title}
              className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
            />
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Continue Watching
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {primaryCourse.title}
              </h3>
              <p className="text-xs text-slate-400">
                Next: {primaryCourse.modules[0]?.lectures[0]?.title}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-36 text-center sm:text-right">
              <div className="text-xs font-bold text-amber-400">{primaryPct}% Completed</div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                  style={{ width: `${primaryPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                const targetLec = primaryCourse.modules[0]?.lectures[0];
                if (targetLec) onOpenPlayer(primaryCourse, targetLec);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Learning</span>
            </button>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white font-['Outfit']">
            My Enrolled Batches ({enrolledCourses.length})
          </h2>
          <button onClick={() => navigate('/courses')} className="text-xs text-amber-400 font-semibold hover:underline">
            View All Available Batches →
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-sm">
            You haven't enrolled in any batches yet. Browse our courses to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const cp = currentCourseProgress[course.id];
              const pct = cp ? cp.progressPercentage : 0;
              return (
                <div
                  key={course.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-video relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-amber-300 border border-amber-500/30">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{course.title}</h4>
                    <div className="text-xs text-slate-400">
                      Instructor: {course.instructor.name}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Batch Progress</span>
                        <span className="text-amber-400 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Details & Notes
                      </button>
                      <button
                        onClick={() => {
                          const first = course.modules[0]?.lectures[0];
                          if (first) onOpenPlayer(course, first);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Issued Certificates Section */}
      {certificates.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Verified Certificates of Completion
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-400">ID: {cert.certificateNumber}</p>
                    <p className="text-[11px] text-emerald-400">Issued: {cert.issuedDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCertificate(cert)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shrink-0"
                >
                  View Credential
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          isOpen={true}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};
