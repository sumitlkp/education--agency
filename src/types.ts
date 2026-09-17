export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  experience: string;
  bio: string;
  avatar: string;
  rating: number;
}

export interface Lecture {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  order: number;
  duration: string;
  durationSeconds: number;
  isFreePreview: boolean;
  videoUrl: string;
  availableQualities: ('360p' | '480p' | '720p' | '1080p')[];
  summary?: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

export interface CourseNote {
  id: string;
  courseId: string;
  title: string;
  chapter: string;
  fileSize: string;
  isPaid?: boolean;
  isFree?: boolean;
  fileUrl: string;
  downloadCount?: number;
}

export interface LiveClass {
  id: string;
  courseId: string;
  courseTitle?: string;
  batchName?: string;
  title?: string;
  topic: string;
  instructorName: string;
  date?: string;
  time?: string;
  scheduledTime?: string;
  duration?: string;
  isLiveNow: boolean;
  meetingUrl: string;
  recordingUrl?: string;
}

export type CourseType = 'live' | 'recorded';
export type CourseStatus = 'published' | 'draft' | 'inactive';

export interface Course {
  id: string;
  slug?: string;
  title: string;
  category: 'ITI Technical' | 'Railway Exams' | 'SSC & Gov' | 'Skill Development';
  type: CourseType;
  status: CourseStatus;
  instructor: Instructor;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  studentsEnrolled: number;
  studentsCount?: number;
  duration: string;
  validityMonths: number;
  totalVideos: number;
  totalNotes: number;
  originalPrice: number;
  discountedPrice: number;
  badgeText?: string;
  isFeatured?: boolean;
  description: string;
  language?: string;
  whatYouWillLearn: string[];
  features: string[];
  requirements: string[];
  modules: CourseModule[];
  notes: CourseNote[];
  liveClasses?: LiveClass[];
  timetable?: {
    id: string;
    day: string;
    time: string;
    topic: string;
    instructor: string;
    isLiveNow?: boolean;
  }[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt: string;
  orderId: string;
  progressPercentage: number;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING';
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  courseId: string;
  courseTitle?: string;
  amount: number;
  originalPrice?: number;
  discountAmount?: number;
  couponCode?: string;
  paymentStatus?: PaymentStatus;
  status?: string;
  paymentMethod?: PaymentMethod | string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface CourseProgress {
  courseId: string;
  userId?: string;
  completedLectureIds?: string[];
  completedLectures?: string[];
  lastWatchedLectureId?: string;
  lastWatchedTimeSeconds?: number;
  progressPercentage: number;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  certificateId?: string;
  certificateNumber?: string;
  userId: string;
  studentName: string;
  courseId: string;
  courseName?: string;
  courseTitle?: string;
  completionDate?: string;
  instructorName: string;
  issueDate?: string;
  issuedDate?: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'lecture' | 'note' | 'live' | 'payment' | 'enrollment' | 'certificate';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}
