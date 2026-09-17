import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { MobileBottomNav } from './components/common/MobileBottomNav.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { AiStudyAssistant } from './components/ai/AiStudyAssistant.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { PaymentModal } from './components/checkout/PaymentModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { CoursesPage } from './pages/CoursesPage.tsx';
import { CourseDetailsPage } from './pages/CourseDetailsPage.tsx';
import { CoursePlayerPage } from './pages/CoursePlayerPage.tsx';
import { LiveClassesPage } from './pages/LiveClassesPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { StudentDashboardPage } from './pages/StudentDashboardPage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { CertificatesPage } from './pages/CertificatesPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

import { Course, Lecture } from './types.ts';

const MainApp: React.FC = () => {
  const { courses } = useApp();

  // Navigation route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, []);

  // When courses load, if path is /course/:id or /learn/:id, resolve selectedCourse
  useEffect(() => {
    if (courses.length === 0) return;

    if (currentPath.startsWith('/course/')) {
      const id = currentPath.replace('/course/', '');
      const found = courses.find((c) => c.id === id);
      if (found) setSelectedCourse(found);
    } else if (currentPath.startsWith('/learn/')) {
      const id = currentPath.replace('/learn/', '');
      const found = courses.find((c) => c.id === id);
      if (found) {
        setSelectedCourse(found);
        if (!activeLecture && found.modules[0]?.lectures[0]) {
          setActiveLecture(found.modules[0].lectures[0]);
        }
      }
    }
  }, [currentPath, courses, activeLecture]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    navigate(`/course/${course.id}`);
  };

  const handleOpenPlayer = (course: Course, lecture: Lecture) => {
    setSelectedCourse(course);
    setActiveLecture(lecture);
    navigate(`/learn/${course.id}`);
  };

  const handleOpenCheckout = (course: Course) => {
    setPaymentCourse(course);
  };

  // Render current page view
  const renderCurrentView = () => {
    if (currentPath.startsWith('/learn/') && selectedCourse && activeLecture) {
      return (
        <CoursePlayerPage
          course={selectedCourse}
          initialLecture={activeLecture}
          onBack={() => navigate(`/course/${selectedCourse.id}`)}
          onOpenEnrollModal={() => handleOpenCheckout(selectedCourse)}
        />
      );
    }

    if (currentPath.startsWith('/course/') && selectedCourse) {
      return (
        <CourseDetailsPage
          course={selectedCourse}
          onBack={() => navigate('/courses')}
          onOpenPlayer={handleOpenPlayer}
          onOpenCheckout={handleOpenCheckout}
        />
      );
    }

    switch (currentPath) {
      case '/courses':
        return (
          <CoursesPage
            onSelectCourse={handleSelectCourse}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );

      case '/live':
        return (
          <LiveClassesPage
            onSelectCourse={handleSelectCourse}
            onOpenCheckout={handleOpenCheckout}
          />
        );

      case '/favorites':
        return (
          <FavoritesPage
            onSelectCourse={handleSelectCourse}
            navigate={navigate}
          />
        );

      case '/dashboard':
      case '/my-courses':
        return (
          <StudentDashboardPage
            onSelectCourse={handleSelectCourse}
            onOpenPlayer={handleOpenPlayer}
            navigate={navigate}
          />
        );

      case '/certificates':
        return <CertificatesPage />;

      case '/orders':
        return <OrdersPage navigate={navigate} />;

      case '/admin':
        return <AdminDashboardPage navigate={navigate} />;

      case '/':
      default:
        return (
          <HomePage
            navigate={navigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectCourse={handleSelectCourse}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky Header */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">{renderCurrentView()}</main>

      {/* Floating AI Study Assistant (Gemini) */}
      <AiStudyAssistant />

      {/* Global Toast System */}
      <ToastContainer />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {paymentCourse && (
        <PaymentModal
          course={paymentCourse}
          isOpen={true}
          onClose={() => setPaymentCourse(null)}
          onSuccess={(courseId) => {
            const course = courses.find((c) => c.id === courseId);
            if (course && course.modules[0]?.lectures[0]) {
              handleOpenPlayer(course, course.modules[0].lectures[0]);
            }
          }}
        />
      )}

      {/* Mobile Bottom Navigation Bar (Section 21) */}
      <MobileBottomNav
        currentPath={currentPath}
        navigate={navigate}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Comprehensive Footer */}
      <Footer navigate={navigate} />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
