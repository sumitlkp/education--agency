import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Course, Enrollment, Order, CourseProgress, Certificate, Notification, LiveClass } from '../types.ts';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  courses: Course[];
  loadingCourses: boolean;
  favorites: string[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  orders: Order[];
  notifications: Notification[];
  activeLiveClasses: LiveClass[];
  toasts: Toast[];
  currentCourseProgress: Record<string, CourseProgress>;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleFavorite: (courseId: string) => Promise<void>;
  isFavorite: (courseId: string) => boolean;
  isEnrolled: (courseId: string) => boolean;
  refreshCourses: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateLectureProgress: (courseId: string, lectureId: string, completed: boolean, timeSeconds?: number) => Promise<void>;
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  verifyAccess: (courseId: string, type: 'lecture' | 'note' | 'live', itemId: string) => Promise<{ allowed: boolean; message?: string }>;
  markNotificationRead: (id: string) => Promise<void>;
  fetchCertificates: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged in as demo student for immediate functional UX
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('studyway_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return {
      id: 'user-student-1',
      name: 'Aman Sharma',
      email: 'student@studywayindia.in',
      mobile: '9876543210',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T10:00:00.000Z'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('studyway_token') || 'token-demo-student';
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>(['course-1', 'course-2']);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeLiveClasses, setActiveLiveClasses] = useState<LiveClass[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentCourseProgress, setCurrentCourseProgress] = useState<Record<string, CourseProgress>>({});

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setEnrollments([]);
      setFavorites([]);
      setOrders([]);
      setNotifications([]);
      return;
    }

    try {
      // Fetch enrollments
      const enrRes = await fetch(`/api/enrollments?userId=${user.id}`);
      const enrData = await enrRes.json();
      if (enrData.enrollments) {
        setEnrollments(enrData.enrollments.map((e: any) => e.enrollment));
        const progressMap: Record<string, CourseProgress> = {};
        enrData.enrollments.forEach((item: any) => {
          if (item.progress) {
            progressMap[item.enrollment.courseId] = item.progress;
          }
        });
        setCurrentCourseProgress((prev) => ({ ...prev, ...progressMap }));
      }

      // Fetch favorites
      const favRes = await fetch(`/api/favorites?userId=${user.id}`);
      const favData = await favRes.json();
      if (favData.courseIds) {
        setFavorites(favData.courseIds);
      }

      // Fetch orders
      const ordRes = await fetch(`/api/orders?userId=${user.id}&role=${user.role}`);
      const ordData = await ordRes.json();
      if (ordData.orders) {
        setOrders(ordData.orders);
      }

      // Fetch notifications
      const notifRes = await fetch(`/api/notifications?userId=${user.id}`);
      const notifData = await notifRes.json();
      if (notifData.notifications) {
        setNotifications(notifData.notifications);
      }

      // Fetch live classes
      const liveRes = await fetch('/api/live-classes');
      const liveData = await liveRes.json();
      if (liveData.liveClasses) {
        setActiveLiveClasses(liveData.liveClasses);
      }

      // Fetch certificates
      const certRes = await fetch(`/api/certificates?userId=${user.id}`);
      const certData = await certRes.json();
      if (certData.certificates) {
        setCertificates(certData.certificates);
      }
    } catch (err) {
      console.error('Failed to fetch user state', err);
    }
  }, [user]);

  const fetchCertificates = useCallback(async () => {
    if (!user) return;
    try {
      const certRes = await fetch(`/api/certificates?userId=${user.id}`);
      const certData = await certRes.json();
      if (certData.certificates) {
        setCertificates(certData.certificates);
      }
    } catch (err) {
      console.error('Failed to fetch certificates', err);
    }
  }, [user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('studyway_user', JSON.stringify(newUser));
    localStorage.setItem('studyway_token', newToken);
    addToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('studyway_user');
    localStorage.removeItem('studyway_token');
    setEnrollments([]);
    setFavorites([]);
    addToast('Logged out successfully', 'info');
  };

  const toggleFavorite = async (courseId: string) => {
    if (!user) {
      addToast('Please login to save courses to your favorites', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId })
      });
      const data = await res.json();
      if (data.success) {
        setFavorites(data.favorites);
        if (data.isFavorite) {
          addToast('Added to your Favorites ❤️', 'success');
        } else {
          addToast('Removed from Favorites', 'info');
        }
      }
    } catch (err) {
      console.error('Error toggling favorite', err);
    }
  };

  const isFavorite = (courseId: string) => favorites.includes(courseId);

  const isEnrolled = (courseId: string) => {
    if (user?.role === 'admin') return true; // Admin has universal access
    return enrollments.some((e) => e.courseId === courseId);
  };

  const updateLectureProgress = async (
    courseId: string,
    lectureId: string,
    completed: boolean,
    timeSeconds?: number
  ) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/progress/${courseId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          lectureId,
          completed,
          timeSeconds
        })
      });
      const data = await res.json();
      if (data.success && data.progress) {
        setCurrentCourseProgress((prev) => ({
          ...prev,
          [courseId]: data.progress
        }));
        // Update enrollment object percentage
        setEnrollments((prev) =>
          prev.map((e) =>
            e.courseId === courseId
              ? { ...e, progressPercentage: data.progress.progressPercentage }
              : e
          )
        );
        if (data.progress.progressPercentage === 100) {
          fetchCertificates();
          addToast('🎉 Congratulations! You completed 100% of the course! Certificate issued.', 'success');
        }
      }
    } catch (err) {
      console.error('Error updating progress', err);
    }
  };

  const verifyAccess = async (courseId: string, type: 'lecture' | 'note' | 'live', itemId: string) => {
    if (user?.role === 'admin') {
      return { allowed: true };
    }
    try {
      const res = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          courseId,
          type,
          itemId
        })
      });
      const data = await res.json();
      if (res.ok && data.allowed) {
        return { allowed: true };
      }
      return { allowed: false, message: data.message || 'Access restricted' };
    } catch {
      return { allowed: false, message: 'Server verification failed' };
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        courses,
        loadingCourses,
        favorites,
        enrollments,
        certificates,
        orders,
        notifications,
        activeLiveClasses,
        toasts,
        currentCourseProgress,
        login,
        logout,
        toggleFavorite,
        isFavorite,
        isEnrolled,
        refreshCourses: fetchCourses,
        refreshUserData: fetchUserData,
        updateLectureProgress,
        addToast,
        removeToast,
        verifyAccess,
        markNotificationRead,
        fetchCertificates
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
