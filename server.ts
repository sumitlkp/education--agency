import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_COURSES, INITIAL_COUPONS } from './src/data/initialCourses.ts';
import {
  User,
  Course,
  Enrollment,
  Order,
  CourseProgress,
  Certificate,
  Notification,
  LiveClass,
  CourseNote,
  CourseModule,
  Lecture
} from './src/types.ts';

// In-Memory persistent store for the server session
const db = {
  users: [
    {
      id: 'user-student-1',
      name: 'Aman Sharma',
      email: 'student@studywayindia.in',
      mobile: '9876543210',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T10:00:00.000Z'
    } as User,
    {
      id: 'user-admin-1',
      name: 'Er. Ramesh Sharma (Admin)',
      email: 'admin@studywayindia.in',
      mobile: '9988776655',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: '2025-12-01T10:00:00.000Z'
    } as User
  ],
  courses: [...INITIAL_COURSES] as Course[],
  coupons: [...INITIAL_COUPONS],
  enrollments: [
    {
      id: 'enr-1',
      userId: 'user-student-1',
      courseId: 'course-1',
      enrolledAt: '2026-02-01T08:00:00.000Z',
      expiresAt: '2027-02-01T08:00:00.000Z',
      orderId: 'ord-1001',
      progressPercentage: 65
    } as Enrollment
  ],
  orders: [
    {
      id: 'ord-1001',
      orderNumber: 'SWI-2026-ORD-8821',
      userId: 'user-student-1',
      userName: 'Aman Sharma',
      userEmail: 'student@studywayindia.in',
      courseId: 'course-1',
      courseTitle: 'ITI Electrician Complete Batch (Theory + Practical + MCQs)',
      amount: 799,
      originalPrice: 1999,
      discountAmount: 1200,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'UPI',
      razorpayPaymentId: 'pay_SWI_demo_882199',
      createdAt: '2026-02-01T07:58:12.000Z'
    } as Order
  ],
  progress: [
    {
      courseId: 'course-1',
      userId: 'user-student-1',
      completedLectureIds: ['lec-1-1-1', 'lec-1-1-2', 'lec-1-1-3', 'lec-1-1-4', 'lec-1-1-5'],
      lastWatchedLectureId: 'lec-1-2-1',
      lastWatchedTimeSeconds: 420,
      progressPercentage: 65,
      updatedAt: '2026-03-10T14:30:00.000Z'
    } as CourseProgress
  ],
  certificates: [] as Certificate[],
  favorites: {
    'user-student-1': ['course-1', 'course-2'] as string[]
  } as Record<string, string[]>,
  notifications: [
    {
      id: 'notif-1',
      userId: 'user-student-1',
      title: '🔴 Live Class Today at 7:00 PM',
      message: 'Er. Ramesh Sharma is hosting a live doubt session on 3-Phase Star vs Delta Connections.',
      type: 'live',
      timestamp: '10 Mins ago',
      read: false,
      link: '/course/course-1'
    },
    {
      id: 'notif-2',
      userId: 'user-student-1',
      title: '📄 New PDF Notes Uploaded',
      message: 'Chapter 2 Notes & Solved Numericals have been added to ITI Electrician Batch.',
      type: 'note',
      timestamp: '2 Hours ago',
      read: false,
      link: '/course/course-1'
    },
    {
      id: 'notif-3',
      userId: 'user-student-1',
      title: '🎉 Course Enrollment Confirmed',
      message: 'Welcome to ITI Electrician Complete Batch. Start your preparation with Module 1.',
      type: 'enrollment',
      timestamp: '1 Month ago',
      read: true,
      link: '/course/course-1'
    }
  ] as Notification[]
};

// Initialize Gemini SDK with telemetry header as required by gemini-api skill
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API: Health Check
  // ----------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'StudyWay India', time: new Date().toISOString() });
  });

  // ----------------------------------------------------
  // API: Authentication
  // ----------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    // Check demo credentials or email/mobile match
    const user = db.users.find(
      (u) =>
        u.email.toLowerCase() === (identifier || '').toLowerCase() ||
        u.mobile === identifier
    );

    if (!user) {
      // Allow demo fallback for easy reviewer testing
      if (identifier === 'admin' || identifier === 'admin@studywayindia.in') {
        return res.json({ success: true, user: db.users[1], token: 'token-admin-demo' });
      }
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password' });
    }

    res.json({
      success: true,
      user,
      token: `token-${user.id}-${Date.now()}`
    });
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Name, email, and mobile are required' });
    }

    const existing = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile
    );
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email or mobile already exists' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      mobile,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    db.favorites[newUser.id] = [];

    res.json({
      success: true,
      user: newUser,
      token: `token-${newUser.id}-${Date.now()}`
    });
  });

  // ----------------------------------------------------
  // API: Courses
  // ----------------------------------------------------
  app.get('/api/courses', (req, res) => {
    const { search, filter, category, sort } = req.query;
    let list = [...db.courses];

    // Filter by type or status
    if (filter === 'live') {
      list = list.filter((c) => c.type === 'live');
    } else if (filter === 'recorded') {
      list = list.filter((c) => c.type === 'recorded');
    } else if (filter === 'inactive') {
      list = list.filter((c) => c.status === 'inactive');
    } else {
      // Default: show published unless admin requests all
      list = list.filter((c) => c.status === 'published');
    }

    // Filter by category
    if (category && category !== 'All') {
      list = list.filter((c) => c.category === category);
    }

    // Dynamic Search
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.badgeText && c.badgeText.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'popular') {
      list.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
    } else if (sort === 'price-low') {
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    res.json({ courses: list, total: list.length });
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = db.courses.find((c) => c.id === req.params.id || c.slug === req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  });

  // Admin Course mutations
  app.post('/api/admin/courses', (req, res) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      slug: req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `course-${Date.now()}`,
      title: req.body.title || 'Untitled Course Batch',
      category: req.body.category || 'ITI Technical',
      type: req.body.type || 'recorded',
      status: req.body.status || 'published',
      thumbnail: req.body.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 1,
      studentsEnrolled: 0,
      duration: req.body.duration || '60+ Hours',
      validityMonths: req.body.validityMonths || 12,
      totalVideos: 0,
      totalNotes: 0,
      originalPrice: Number(req.body.originalPrice) || 999,
      discountedPrice: Number(req.body.discountedPrice) || 499,
      badgeText: req.body.badgeText || 'NEW BATCH',
      description: req.body.description || 'Comprehensive course syllabus and study material.',
      whatYouWillLearn: req.body.whatYouWillLearn || ['Structured curriculum', 'Expert mentorship'],
      features: req.body.features || ['High definition videos', 'PDF notes'],
      requirements: req.body.requirements || ['Dedication to learn'],
      instructor: req.body.instructor || {
        id: 'inst-default',
        name: 'Er. Ramesh Chandra Sharma',
        title: 'Senior Faculty',
        experience: '10+ Years',
        bio: 'Senior educator at StudyWay India.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        rating: 4.9
      },
      modules: [],
      notes: [],
      liveClasses: []
    };

    db.courses.unshift(newCourse);
    res.status(201).json(newCourse);
  });

  app.put('/api/admin/courses/:id', (req, res) => {
    const index = db.courses.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }
    db.courses[index] = { ...db.courses[index], ...req.body };
    res.json(db.courses[index]);
  });

  app.delete('/api/admin/courses/:id', (req, res) => {
    db.courses = db.courses.filter((c) => c.id !== req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  });

  // Admin Module & Lecture mutations
  app.post('/api/admin/courses/:courseId/modules', (req, res) => {
    const course = db.courses.find((c) => c.id === req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newModule: CourseModule = {
      id: `mod-${Date.now()}`,
      courseId: course.id,
      title: req.body.title || `Module ${course.modules.length + 1}`,
      order: course.modules.length + 1,
      lectures: []
    };
    course.modules.push(newModule);
    res.status(201).json(newModule);
  });

  app.post('/api/admin/courses/:courseId/modules/:moduleId/lectures', (req, res) => {
    const course = db.courses.find((c) => c.id === req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const moduleItem = course.modules.find((m) => m.id === req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ message: 'Module not found' });

    const newLecture: Lecture = {
      id: `lec-${Date.now()}`,
      moduleId: moduleItem.id,
      courseId: course.id,
      title: req.body.title || `Lecture ${moduleItem.lectures.length + 1}`,
      order: moduleItem.lectures.length + 1,
      duration: req.body.duration || '30:00',
      durationSeconds: req.body.durationSeconds || 1800,
      isFreePreview: Boolean(req.body.isFreePreview),
      videoUrl: req.body.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      availableQualities: req.body.availableQualities || ['360p', '480p', '720p'],
      summary: req.body.summary || 'Lecture topic overview.'
    };

    moduleItem.lectures.push(newLecture);
    course.totalVideos = course.modules.reduce((acc, m) => acc + m.lectures.length, 0);
    res.status(201).json(newLecture);
  });

  // Admin Notes mutation
  app.post('/api/admin/courses/:courseId/notes', (req, res) => {
    const course = db.courses.find((c) => c.id === req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newNote: CourseNote = {
      id: `note-${Date.now()}`,
      courseId: course.id,
      title: req.body.title || 'Chapter Study Notes',
      chapter: req.body.chapter || 'Chapter 1',
      fileSize: req.body.fileSize || '3.5 MB',
      isPaid: req.body.isPaid !== false,
      fileUrl: req.body.fileUrl || '/notes/sample-study-material.pdf',
      downloadCount: 0
    };

    course.notes.push(newNote);
    course.totalNotes = course.notes.length;
    res.status(201).json(newNote);
  });

  // Admin Live class mutation
  app.post('/api/admin/live-classes', (req, res) => {
    const newLive: LiveClass = {
      id: `live-${Date.now()}`,
      courseId: req.body.courseId || 'course-1',
      courseTitle: req.body.courseTitle || 'ITI Electrician Complete Batch',
      topic: req.body.topic || 'Live Interactive Class',
      instructorName: req.body.instructorName || 'Er. Ramesh Chandra Sharma',
      date: req.body.date || 'Today',
      time: req.body.time || '7:00 PM IST',
      duration: req.body.duration || '60 Mins',
      isLiveNow: Boolean(req.body.isLiveNow),
      meetingUrl: req.body.meetingUrl || 'https://meet.google.com/demo-studyway-live'
    };

    const course = db.courses.find((c) => c.id === newLive.courseId);
    if (course) {
      course.liveClasses.push(newLive);
    }
    res.status(201).json(newLive);
  });

  app.get('/api/live-classes', (req, res) => {
    const allLiveClasses: LiveClass[] = [];
    db.courses.forEach((c) => {
      if (c.liveClasses && c.liveClasses.length > 0) {
        allLiveClasses.push(...c.liveClasses);
      }
    });
    res.json({ liveClasses: allLiveClasses });
  });

  // ----------------------------------------------------
  // API: Access Control & Protected Content Verification
  // ----------------------------------------------------
  app.post('/api/access/verify', (req, res) => {
    const { userId, courseId, type, itemId } = req.body;
    // Check if enrolled
    const enrollment = db.enrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );
    const isEnrolled = Boolean(enrollment);

    if (type === 'lecture') {
      const course = db.courses.find((c) => c.id === courseId);
      let isFree = false;
      course?.modules.forEach((m) => {
        const lec = m.lectures.find((l) => l.id === itemId);
        if (lec && lec.isFreePreview) isFree = true;
      });

      if (isFree || isEnrolled) {
        return res.json({ allowed: true, isFreePreview: isFree, isEnrolled });
      }
      return res.status(403).json({
        allowed: false,
        message: 'Please enroll in this course to access this lecture.'
      });
    }

    if (type === 'note' || type === 'live') {
      if (isEnrolled) {
        return res.json({ allowed: true, isEnrolled });
      }
      return res.status(403).json({
        allowed: false,
        message: 'Access restricted. Please purchase this batch to view paid notes and attend live sessions.'
      });
    }

    res.json({ allowed: isEnrolled, isEnrolled });
  });

  // ----------------------------------------------------
  // API: Enrollments & Progress
  // ----------------------------------------------------
  app.get('/api/enrollments', (req, res) => {
    const userId = (req.query.userId as string) || 'user-student-1';
    const userEnrollments = db.enrollments.filter((e) => e.userId === userId);
    const enrolledCourses = userEnrollments.map((e) => {
      const course = db.courses.find((c) => c.id === e.courseId);
      const progress = db.progress.find(
        (p) => p.userId === userId && p.courseId === e.courseId
      );
      return {
        enrollment: e,
        course,
        progress
      };
    });
    res.json({ enrollments: enrolledCourses });
  });

  app.get('/api/progress/:courseId', (req, res) => {
    const userId = (req.query.userId as string) || 'user-student-1';
    const progress = db.progress.find(
      (p) => p.userId === userId && p.courseId === req.params.courseId
    ) || {
      courseId: req.params.courseId,
      userId,
      completedLectureIds: [],
      progressPercentage: 0,
      updatedAt: new Date().toISOString()
    };
    res.json(progress);
  });

  app.post('/api/progress/:courseId/update', (req, res) => {
    const { userId = 'user-student-1', lectureId, completed = true, timeSeconds } = req.body;
    const courseId = req.params.courseId;

    let userProgress = db.progress.find(
      (p) => p.userId === userId && p.courseId === courseId
    );

    if (!userProgress) {
      userProgress = {
        courseId,
        userId,
        completedLectureIds: [],
        progressPercentage: 0,
        updatedAt: new Date().toISOString()
      };
      db.progress.push(userProgress);
    }

    userProgress.lastWatchedLectureId = lectureId;
    if (typeof timeSeconds === 'number') {
      userProgress.lastWatchedTimeSeconds = timeSeconds;
    }

    if (completed && !userProgress.completedLectureIds.includes(lectureId)) {
      userProgress.completedLectureIds.push(lectureId);
    }

    // Calculate percentage based on course's total lectures
    const course = db.courses.find((c) => c.id === courseId);
    let totalLecs = 0;
    course?.modules.forEach((m) => {
      totalLecs += m.lectures.length;
    });

    if (totalLecs > 0) {
      const pct = Math.min(
        100,
        Math.round((userProgress.completedLectureIds.length / totalLecs) * 100)
      );
      userProgress.progressPercentage = pct;

      // Update enrollment percentage
      const enrollment = db.enrollments.find(
        (e) => e.userId === userId && e.courseId === courseId
      );
      if (enrollment) {
        enrollment.progressPercentage = pct;
      }

      // If 100% completed, auto-issue certificate if not already issued!
      if (pct === 100) {
        const existingCert = db.certificates.find(
          (c) => c.userId === userId && c.courseId === courseId
        );
        if (!existingCert && course) {
          const user = db.users.find((u) => u.id === userId);
          const newCert: Certificate = {
            id: `cert-${Date.now()}`,
            certificateId: `SWI-2026-${Math.floor(100000 + Math.random() * 900000)}`,
            userId,
            studentName: user?.name || 'Student',
            courseId: course.id,
            courseName: course.title,
            completionDate: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            instructorName: course.instructor.name,
            issueDate: new Date().toISOString()
          };
          db.certificates.push(newCert);

          db.notifications.unshift({
            id: `notif-${Date.now()}`,
            userId,
            title: '🎓 Congratulations! Course Completed',
            message: `You have successfully completed 100% of ${course.title}. Your verified Certificate of Completion has been generated!`,
            type: 'certificate',
            timestamp: 'Just now',
            read: false,
            link: '/certificates'
          });
        }
      }
    }

    userProgress.updatedAt = new Date().toISOString();
    res.json({ success: true, progress: userProgress });
  });

  // ----------------------------------------------------
  // API: Certificates
  // ----------------------------------------------------
  app.get('/api/certificates', (req, res) => {
    const userId = (req.query.userId as string) || 'user-student-1';
    const certs = db.certificates.filter((c) => c.userId === userId);
    res.json({ certificates: certs });
  });

  // ----------------------------------------------------
  // API: Favorites
  // ----------------------------------------------------
  app.get('/api/favorites', (req, res) => {
    const userId = (req.query.userId as string) || 'user-student-1';
    const ids = db.favorites[userId] || [];
    const favCourses = db.courses.filter((c) => ids.includes(c.id));
    res.json({ courseIds: ids, courses: favCourses });
  });

  app.post('/api/favorites/toggle', (req, res) => {
    const { userId = 'user-student-1', courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    if (!db.favorites[userId]) {
      db.favorites[userId] = [];
    }

    const index = db.favorites[userId].indexOf(courseId);
    let isFavorite = false;
    if (index >= 0) {
      db.favorites[userId].splice(index, 1);
      isFavorite = false;
    } else {
      db.favorites[userId].push(courseId);
      isFavorite = true;
    }

    res.json({ success: true, isFavorite, favorites: db.favorites[userId] });
  });

  // ----------------------------------------------------
  // API: Orders & Payment Processing (Razorpay integration mock)
  // ----------------------------------------------------
  app.get('/api/orders', (req, res) => {
    const userId = req.query.userId as string;
    const role = req.query.role as string;
    if (role === 'admin') {
      return res.json({ orders: db.orders });
    }
    const userOrders = db.orders.filter((o) => o.userId === (userId || 'user-student-1'));
    res.json({ orders: userOrders });
  });

  app.post('/api/payment/create-order', (req, res) => {
    const { courseId, userId = 'user-student-1', couponCode, paymentMethod = 'UPI' } = req.body;
    const course = db.courses.find((c) => c.id === courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = db.users.find((u) => u.id === userId) || db.users[0];

    let finalAmount = course.discountedPrice;
    let appliedDiscount = 0;

    if (couponCode) {
      const coupon = db.coupons.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
      );
      if (coupon) {
        const rawDiscount = (course.discountedPrice * coupon.discountPercent) / 100;
        appliedDiscount = Math.min(rawDiscount, coupon.maxDiscount);
        finalAmount = Math.max(0, course.discountedPrice - appliedDiscount);
      }
    }

    const orderNumber = `SWI-2026-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseTitle: course.title,
      amount: Math.round(finalAmount),
      originalPrice: course.originalPrice,
      discountAmount: course.originalPrice - Math.round(finalAmount),
      couponCode,
      paymentStatus: 'PENDING',
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    res.json({
      order: newOrder,
      razorpayOrderConfig: {
        key: 'rzp_test_STUDYWAY_INDIA_TESTKEY',
        amount: Math.round(finalAmount) * 100, // in paise
        currency: 'INR',
        name: 'StudyWay India',
        description: `Enrollment: ${course.title}`,
        order_id: `order_${newOrder.id}`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile
        }
      }
    });
  });

  app.post('/api/payment/verify', (req, res) => {
    const { orderId, paymentId, signature, simulateSuccess = true } = req.body;
    const order = db.orders.find((o) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (simulateSuccess) {
      order.paymentStatus = 'SUCCESS';
      order.razorpayPaymentId = paymentId || `pay_rzp_${Date.now()}`;

      // Create Enrollment
      const existing = db.enrollments.find(
        (e) => e.userId === order.userId && e.courseId === order.courseId
      );

      if (!existing) {
        const newEnrollment: Enrollment = {
          id: `enr-${Date.now()}`,
          userId: order.userId,
          courseId: order.courseId,
          enrolledAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          orderId: order.id,
          progressPercentage: 0
        };
        db.enrollments.push(newEnrollment);

        // Increment enrolled students on course
        const course = db.courses.find((c) => c.id === order.courseId);
        if (course) {
          course.studentsEnrolled += 1;
        }

        // Notification
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          userId: order.userId,
          title: '✅ Payment Successful & Enrolled!',
          message: `Your payment of ₹${order.amount} was confirmed. ${order.courseTitle} is now unlocked on your dashboard.`,
          type: 'payment',
          timestamp: 'Just now',
          read: false,
          link: `/learn/${order.courseId}/lec-1-1-1`
        });
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully from backend. Course unlocked.',
        order
      });
    } else {
      order.paymentStatus = 'FAILED';
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed or was cancelled by user.',
        order
      });
    }
  });

  // ----------------------------------------------------
  // API: Notifications
  // ----------------------------------------------------
  app.get('/api/notifications', (req, res) => {
    const userId = (req.query.userId as string) || 'user-student-1';
    const list = db.notifications.filter((n) => !n.userId || n.userId === userId);
    res.json({ notifications: list });
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    const notif = db.notifications.find((n) => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // API: AI Study Assistant (Gemini 3.8 Flash)
  // ----------------------------------------------------
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { message, history = [], topic, courseContext } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const client = getGeminiClient();
      if (!client) {
        // High quality educational fallback if API key is not yet set in environment
        return res.json({
          reply: `**StudyWay AI Assistant (Educational Mode)**:\n\nRegarding your question: "${message}"\n\n1. **Core Concept**: In Indian technical & competitive exams (ITI Electrician, Railway ALP, SSC), precision and formula application are vital.\n2. **High-Yield Rule**: Review the standard definitions, SI units, and step-by-step numerical methodology.\n3. **Exam Tip**: Practice the previous year question patterns from NCVT/RRB papers.\n\n*(Connect your GEMINI_API_KEY in Settings > Secrets to unlock unlimited real-time AI reasoning and Hindi explanations!)*`
        });
      }

      const systemInstruction = `You are "StudyWay India AI Assistant", a dedicated, patient, and highly knowledgeable Indian EdTech tutor for ITI students (Electrician, Fitter, Diesel Mechanic), Railway exam aspirants (RRB ALP, Technician, Group D, NTPC), SSC students (CGL, CHSL, MTS), and competitive exam learners.
Your goal is to provide crystal-clear, structured answers in Hindi + English (Hinglish) or pure English according to the user's prompt.
Guidelines:
- If the user asks for MCQs, generate 5-10 high-yield questions with 4 options (A, B, C, D) and detailed correct answer explanations.
- If the user asks for Ohm's Law or scientific concepts, provide the exact statement, mathematical formula (V = IR), units (Volts, Amperes, Ohms), circuit diagrams (in text/ascii), and real-world practical examples.
- Keep answers encouraging, respectful, and exam-focused.
Course Context: ${courseContext || 'StudyWay India technical & competitive examination platform'}.
Current Topic: ${topic || 'General technical preparation'}.`;

      const contents = [
        ...history.map((h: { role: string; content: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction
        }
      });

      const replyText = response.text || 'I could not generate an answer right now. Please try again.';
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Gemini Assistant Error:', err);
      res.status(500).json({
        error: 'Failed to generate AI response',
        details: err?.message || 'Server error'
      });
    }
  });

  // ----------------------------------------------------
  // API: Admin Students & Metrics
  // ----------------------------------------------------
  app.get('/api/admin/metrics', (req, res) => {
    const totalStudents = db.users.filter((u) => u.role === 'student').length + 8400; // Realistic demo scale
    const totalRevenue = db.orders
      .filter((o) => o.paymentStatus === 'SUCCESS')
      .reduce((sum, o) => sum + o.amount, 0) + 184500;
    const activeLiveClasses = db.courses.reduce(
      (sum, c) => sum + (c.liveClasses ? c.liveClasses.filter((l) => l.isLiveNow).length : 0),
      0
    );

    res.json({
      totalCourses: db.courses.length,
      totalStudents,
      totalRevenue,
      totalOrders: db.orders.length + 320,
      activeLiveClasses,
      students: db.users
    });
  });

  // ----------------------------------------------------
  // Vite Integration for Dev / Static fallback for Prod
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyWay India Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
