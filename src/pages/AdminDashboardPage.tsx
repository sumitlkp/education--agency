import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Course, LiveClass, CourseNote, Order } from '../types.ts';
import {
  ShieldCheck,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Radio,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  X,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  Layers
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user, courses, activeLiveClasses, orders, refreshCourses, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'live' | 'notes' | 'orders'>('overview');

  // New course modal state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('ITI Technical');
  const [newType, setNewType] = useState<'live' | 'recorded'>('live');
  const [newOrigPrice, setNewOrigPrice] = useState('1499');
  const [newDiscPrice, setNewDiscPrice] = useState('699');
  const [newDuration, setNewDuration] = useState('120 Hours');
  const [newInstructor, setNewInstructor] = useState('Er. Ramesh Sharma');
  const [newDescription, setNewDescription] = useState('');

  // Schedule live class modal state
  const [showScheduleLiveModal, setShowScheduleLiveModal] = useState(false);
  const [liveBatchId, setLiveBatchId] = useState(courses[0]?.id || '');
  const [liveTopic, setLiveTopic] = useState('');
  const [liveDayTime, setLiveDayTime] = useState('Today at 07:00 PM');
  const [liveIsNow, setLiveIsNow] = useState(false);

  // Add note modal state
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteCourseId, setNoteCourseId] = useState(courses[0]?.id || '');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteChapter, setNoteChapter] = useState('');
  const [noteIsFree, setNoteIsFree] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          This portal is restricted to StudyWay faculty and administrators. Please sign in with the Admin account in the demo login options.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const totalStudents = courses.reduce((acc, c) => acc + (c.studentsCount ?? c.studentsEnrolled ?? 0), 0);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin'
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          type: newType,
          originalPrice: parseInt(newOrigPrice, 10),
          discountedPrice: parseInt(newDiscPrice, 10),
          duration: newDuration,
          instructorName: newInstructor,
          description: newDescription
        })
      });
      const data = await res.json();
      if (res.ok && data.course) {
        addToast(`New course "${newTitle}" created successfully!`, 'success');
        await refreshCourses();
        setShowAddCourseModal(false);
        setNewTitle('');
        setNewDescription('');
      } else {
        addToast(data.message || 'Failed to create course', 'error');
      }
    } catch {
      addToast('Error saving course', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'x-admin-role': 'admin' }
      });
      if (res.ok) {
        addToast('Course removed from database', 'info');
        await refreshCourses();
      }
    } catch {
      addToast('Error deleting course', 'error');
    }
  };

  const handleScheduleLive = async (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === liveBatchId);
    if (!course) return;

    try {
      const res = await fetch('/api/admin/live-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin'
        },
        body: JSON.stringify({
          courseId: course.id,
          batchName: course.title,
          title: liveTopic,
          instructorName: course.instructor.name,
          scheduledTime: liveDayTime,
          isLiveNow: liveIsNow,
          meetingUrl: 'https://meet.google.com'
        })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(`Live class "${liveTopic}" scheduled!`, 'success');
        setShowScheduleLiveModal(false);
        setLiveTopic('');
      }
    } catch {
      addToast('Failed to schedule live class', 'error');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin'
        },
        body: JSON.stringify({
          courseId: noteCourseId,
          title: noteTitle,
          chapter: noteChapter,
          isFree: noteIsFree,
          fileSize: '4.8 MB',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        })
      });
      if (res.ok) {
        addToast(`PDF Note "${noteTitle}" added to batch!`, 'success');
        await refreshCourses();
        setShowAddNoteModal(false);
        setNoteTitle('');
        setNoteChapter('');
      }
    } catch {
      addToast('Failed to add note', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            StudyWay Central Administration
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Admin Management Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage course curriculum, schedule live doubt sessions, upload PDF notes, and review student orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddCourseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Batch</span>
          </button>

          <button
            onClick={() => setShowScheduleLiveModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Radio className="w-4 h-4" />
            <span>Schedule Live Class</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold mb-1">Total Batches</div>
          <div className="text-2xl font-extrabold text-white">{courses.length}</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">Published & Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold mb-1">Total Enrolled Aspirants</div>
          <div className="text-2xl font-extrabold text-white">{totalStudents.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">+124 this week</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold mb-1">Total Platform Revenue</div>
          <div className="text-2xl font-extrabold text-white">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-purple-400 mt-1 font-medium">Direct UPI & Card</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold mb-1">Live Classes Scheduled</div>
          <div className="text-2xl font-extrabold text-white">{activeLiveClasses.length}</div>
          <div className="text-[11px] text-rose-400 mt-1 font-medium">Bilingual Hinglish</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Batches ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'live' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Schedules ({activeLiveClasses.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Orders & Transactions ({orders.length})
        </button>
      </div>

      {/* Tab 1: Course Management Table */}
      {activeTab === 'overview' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Manage Course Offerings</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddNoteModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload PDF Note</span>
              </button>
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Batch Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Lectures / Notes</th>
                  <th className="p-4">Enrolled Students</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-white max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-300">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4 uppercase font-bold text-[10px]">
                      {c.type === 'live' ? (
                        <span className="text-rose-400">🔴 Live</span>
                      ) : (
                        <span className="text-blue-400">📹 Recorded</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      ₹{c.discountedPrice}{' '}
                      <span className="text-slate-500 line-through text-[11px]">₹{c.originalPrice}</span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {c.totalVideos} Videos • {c.totalNotes} Notes
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {(c.studentsCount ?? c.studentsEnrolled ?? 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Live Schedules Table */}
      {activeTab === 'live' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Daily Live Class Timetable</h3>
            <button
              onClick={() => setShowScheduleLiveModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Live Class</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {activeLiveClasses.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.title}</span>
                    {item.isLiveNow && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Batch: {item.batchName} • Instructor: {item.instructorName} • Time: {item.scheduledTime}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                  >
                    Open Room
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Orders Table */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Student Enrollment Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Batch ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-medium text-amber-400">{o.id}</td>
                    <td className="p-4 font-mono text-slate-400">{o.userId}</td>
                    <td className="p-4 font-mono text-slate-300">{o.courseId}</td>
                    <td className="p-4 font-bold text-white text-sm">₹{o.amount}</td>
                    <td className="p-4 uppercase">{o.paymentMethod || 'UPI'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddCourseModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create New Batch</h3>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. ITI Fitter Complete Theory Batch 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="ITI Technical">ITI Technical</option>
                    <option value="Railway Exams">Railway Exams</option>
                    <option value="SSC & Gov">SSC & Gov</option>
                    <option value="Skill Development">Skill Development</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Delivery Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="live">Live Interactive</option>
                    <option value="recorded">Recorded Masterclass</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discounted Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDiscPrice}
                    onChange={(e) => setNewDiscPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lead Instructor</label>
                  <input
                    type="text"
                    required
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Target students, syllabus coverage, exam focus..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm mt-2 transition-colors shadow-md shadow-amber-500/20"
              >
                Publish Course to Platform
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Live Class */}
      {showScheduleLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowScheduleLiveModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Schedule Live Class</h3>

            <form onSubmit={handleScheduleLive} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Batch</label>
                <select
                  value={liveBatchId}
                  onChange={(e) => setLiveBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  required
                  value={liveTopic}
                  onChange={(e) => setLiveTopic(e.target.value)}
                  placeholder="e.g. Three Phase Induction Motors & Slip Calculation"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Scheduled Day & Time</label>
                <input
                  type="text"
                  required
                  value={liveDayTime}
                  onChange={(e) => setLiveDayTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="liveNowCheck"
                  checked={liveIsNow}
                  onChange={(e) => setLiveIsNow(e.target.checked)}
                  className="rounded accent-rose-500"
                />
                <label htmlFor="liveNowCheck" className="text-rose-400 font-bold cursor-pointer">
                  Mark as "🔴 LIVE NOW" immediately
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm mt-4 transition-colors"
              >
                Broadcast Live Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload PDF Note */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddNoteModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Upload PDF Study Note</h3>

            <form onSubmit={handleAddNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Batch</label>
                <select
                  value={noteCourseId}
                  onChange={(e) => setNoteCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Transformer Theory & Formula Sheet"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Chapter / Subject</label>
                <input
                  type="text"
                  required
                  value={noteChapter}
                  onChange={(e) => setNoteChapter(e.target.value)}
                  placeholder="e.g. Electrical Machines"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="freeNoteCheck"
                  checked={noteIsFree}
                  onChange={(e) => setNoteIsFree(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <label htmlFor="freeNoteCheck" className="text-slate-300 cursor-pointer">
                  Allow Free Preview download for guest students
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm mt-4 transition-colors"
              >
                Upload Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
