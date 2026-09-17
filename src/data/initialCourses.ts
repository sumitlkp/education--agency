import { Course, Coupon } from '../types.ts';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'STUDY50',
    discountPercent: 50,
    maxDiscount: 500,
    minOrder: 499,
    description: 'Flat 50% discount up to ₹500 for new students'
  },
  {
    code: 'SELECTION10',
    discountPercent: 10,
    maxDiscount: 200,
    minOrder: 299,
    description: 'Extra 10% instant off on all batches'
  },
  {
    code: 'RAILWAY20',
    discountPercent: 20,
    maxDiscount: 400,
    minOrder: 499,
    description: 'Special 20% discount for Railway & ITI aspirants'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    slug: 'iti-electrician-complete-batch',
    title: 'ITI Electrician Complete Batch (Theory + Practical + MCQs)',
    category: 'ITI Technical',
    type: 'live',
    status: 'published',
    isFeatured: true,
    badgeText: 'BESTSELLER • LIVE BATCH',
    thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 2480,
    studentsEnrolled: 8650,
    duration: '160+ Hours',
    validityMonths: 12,
    totalVideos: 48,
    totalNotes: 24,
    originalPrice: 1999,
    discountedPrice: 799,
    description: 'Complete syllabus coverage for ITI Electrician 1st & 2nd Year along with preparation for Railway ALP, Technician, UPPCL, DMRC, and State Electricity Board exams. Covers Electrical theory, workshop calculations, engineering drawings, circuit schematics, and live doubt sessions.',
    whatYouWillLearn: [
      'Complete D.C. Theory, Ohm’s Law, Kirchhoff’s Laws and Network Theorems',
      'A.C. Fundamentals, Single Phase and 3-Phase Polyphase Systems',
      'Transformers, DC Machines, Induction Motors, and Synchronous Alternators',
      'Domestic & Industrial Electrical Wiring, Earthing, and Safety Precautions',
      'Over 2,500+ NCVT / NIMI Pattern High-Yield Multiple Choice Questions'
    ],
    features: [
      'Daily 7:00 PM Live Interactive Theory Classes',
      'Downloadable PDF Handwritten & Printed Study Notes',
      'Chapter-wise Practice Tests with Video Explanations',
      'Special NCVT & Railway Exam PYQ (Previous Year Questions) Discussions',
      'Full 1 Year Course Validity with Unlimited Recorded Video Playback'
    ],
    requirements: [
      'ITI Electrician / Wireman student or 10th pass preparing for technical exams',
      'Basic curiosity for electrical appliances and engineering concepts',
      'A smartphone or laptop with active internet connection'
    ],
    instructor: {
      id: 'inst-1',
      name: 'Er. Ramesh Chandra Sharma',
      title: 'Senior Electrical Faculty & Ex-Railway Section Engineer',
      experience: '14+ Years Teaching Experience',
      bio: 'Er. Ramesh Sharma has trained over 45,000+ ITI students and helped more than 6,200 candidates crack Railway ALP, Technician Grade-1/2, and State Power Board examinations.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    modules: [
      {
        id: 'mod-1-1',
        courseId: 'course-1',
        title: 'Module 1 — Basic Electricity & Fundamental Laws',
        order: 1,
        lectures: [
          {
            id: 'lec-1-1-1',
            moduleId: 'mod-1-1',
            courseId: 'course-1',
            title: 'Lecture 1 — Introduction to Electricity & Atomic Structure',
            order: 1,
            duration: '32:15',
            durationSeconds: 1935,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'Fundamentals of electric charge, valence electrons, conductor vs semiconductor vs insulator properties, and atomic structure basics.'
          },
          {
            id: 'lec-1-1-2',
            moduleId: 'mod-1-1',
            courseId: 'course-1',
            title: 'Lecture 2 — Electric Current, Drift Velocity & Ampere Definition',
            order: 2,
            duration: '28:40',
            durationSeconds: 1720,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'Understanding potential difference, electromotive force (EMF), conventional current vs electron flow.'
          },
          {
            id: 'lec-1-1-3',
            moduleId: 'mod-1-1',
            courseId: 'course-1',
            title: 'Lecture 3 — Voltage, Potential Difference & Work Done',
            order: 3,
            duration: '35:10',
            durationSeconds: 2110,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Detailed mathematical derivation of volt, work done per unit charge, and measurement with voltmeters.'
          },
          {
            id: 'lec-1-1-4',
            moduleId: 'mod-1-1',
            courseId: 'course-1',
            title: 'Lecture 4 — Resistance, Specific Resistance & Temperature Coefficient',
            order: 4,
            duration: '42:50',
            durationSeconds: 2570,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'Factors affecting electrical resistance: length, cross-sectional area, resistivity of copper, aluminum, nichrome.'
          },
          {
            id: 'lec-1-1-5',
            moduleId: 'mod-1-1',
            courseId: 'course-1',
            title: 'Lecture 5 — Ohm’s Law, Verification & Practical Limitations',
            order: 5,
            duration: '39:20',
            durationSeconds: 2360,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Statement of Ohm’s law, V-I characteristics, linear vs non-linear conductors, temperature effects.'
          }
        ]
      },
      {
        id: 'mod-1-2',
        courseId: 'course-1',
        title: 'Module 2 — Magnetism, Electromagnetism & Inductance',
        order: 2,
        lectures: [
          {
            id: 'lec-1-2-1',
            moduleId: 'mod-1-2',
            courseId: 'course-1',
            title: 'Lecture 6 — Magnetic Fields, Flux Density & Faraday’s Laws',
            order: 1,
            duration: '36:12',
            durationSeconds: 2172,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Electromagnetic induction principles, Fleming’s right & left hand rules, Lenz’s law.'
          },
          {
            id: 'lec-1-2-2',
            moduleId: 'mod-1-2',
            courseId: 'course-1',
            title: 'Lecture 7 — Inductance, Self & Mutual Induction with Practical Coils',
            order: 2,
            duration: '41:00',
            durationSeconds: 2460,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Henrys, energy stored in magnetic field, transformer core working.'
          }
        ]
      },
      {
        id: 'mod-1-3',
        courseId: 'course-1',
        title: 'Module 3 — AC Fundamentals & Polyphase Circuits',
        order: 3,
        lectures: [
          {
            id: 'lec-1-3-1',
            moduleId: 'mod-1-3',
            courseId: 'course-1',
            title: 'Lecture 8 — Sine Waves, RMS Value, Average Value & Form Factor',
            order: 1,
            duration: '45:30',
            durationSeconds: 2730,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'Sinusoidal alternating currents, frequency, peak factor, phasor representation.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-1-1',
        courseId: 'course-1',
        title: 'Chapter 1 Notes — Basic Electricity & Safety Rules (Handwritten Hindi+English)',
        chapter: 'Chapter 1',
        fileSize: '4.2 MB',
        isPaid: true,
        fileUrl: '/notes/iti-electrician-ch1.pdf',
        downloadCount: 1820
      },
      {
        id: 'note-1-2',
        courseId: 'course-1',
        title: 'Chapter 2 Notes — Ohm’s Law & Kirchhoff’s Laws Solved Numericals',
        chapter: 'Chapter 2',
        fileSize: '6.8 MB',
        isPaid: true,
        fileUrl: '/notes/iti-electrician-ch2.pdf',
        downloadCount: 1430
      },
      {
        id: 'note-1-3',
        courseId: 'course-1',
        title: 'NCVT NIMI 500 High-Yield Practice MCQs with Answer Key',
        chapter: 'Question Bank',
        fileSize: '8.5 MB',
        isPaid: true,
        fileUrl: '/notes/iti-electrician-mcqs.pdf',
        downloadCount: 3100
      },
      {
        id: 'note-1-4',
        courseId: 'course-1',
        title: 'Railway ALP & Tech Previous 5 Years Solved Electrical Papers',
        chapter: 'Previous Year Papers',
        fileSize: '12.4 MB',
        isPaid: true,
        fileUrl: '/notes/railway-alp-electrician-pyq.pdf',
        downloadCount: 2950
      }
    ],
    liveClasses: [
      {
        id: 'live-1-1',
        courseId: 'course-1',
        courseTitle: 'ITI Electrician Complete Batch',
        topic: 'Live Q&A • 3-Phase Star vs Delta Connections & Power Factor Correction',
        instructorName: 'Er. Ramesh Chandra Sharma',
        date: 'Today',
        time: '7:00 PM IST',
        duration: '75 Mins',
        isLiveNow: true,
        meetingUrl: 'https://meet.google.com/demo-studyway-live'
      },
      {
        id: 'live-1-2',
        courseId: 'course-1',
        courseTitle: 'ITI Electrician Complete Batch',
        topic: 'Transformer Losses, Efficiency & Open/Short Circuit Test Numericals',
        instructorName: 'Er. Ramesh Chandra Sharma',
        date: 'Tomorrow',
        time: '7:00 PM IST',
        duration: '60 Mins',
        isLiveNow: false,
        meetingUrl: 'https://meet.google.com/demo-studyway-live'
      }
    ]
  },
  {
    id: 'course-2',
    slug: 'railway-group-d-complete-preparation',
    title: 'Railway Group D & RRB ALP Complete Preparation Batch 2026',
    category: 'Railway Exams',
    type: 'live',
    status: 'published',
    isFeatured: true,
    badgeText: 'POPULAR • TARGET 2026',
    thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 3890,
    studentsEnrolled: 14200,
    duration: '220+ Hours',
    validityMonths: 12,
    totalVideos: 64,
    totalNotes: 32,
    originalPrice: 1799,
    discountedPrice: 699,
    description: 'Comprehensive preparation batch strictly mapped to the latest RRB (Railway Recruitment Board) syllabus. Covers General Science (Physics, Chemistry, Biology), Mathematics, General Intelligence & Reasoning, and Current Affairs with regular mock tests.',
    whatYouWillLearn: [
      'Complete General Science with NCERT Class 9th & 10th deep concept explanations',
      'Short-trick arithmetic methods for Railway time and distance, work, profit-loss',
      'Logical and non-verbal reasoning patterns frequently asked in RRB exams',
      'Monthly Current Affairs compilations and Railway Static GK'
    ],
    features: [
      'Bilingual lectures in Hinglish (Hindi + English key terms)',
      '15 Full Length Mock Tests in actual RRB CBT exam interface',
      'Instant doubt support via community discussions',
      'Special formula cheat sheets and science diagram cards'
    ],
    requirements: [
      '10th pass or ITI holder targeting Indian Railways jobs',
      'Dedication to attend 2 hours daily study'
    ],
    instructor: {
      id: 'inst-2',
      name: 'Dr. Vikas Kumar Verma',
      title: 'Railway Exam Specialist & NCERT Mentor',
      experience: '11+ Years Experience',
      bio: 'Dr. Vikas Verma is renowned across northern India for making General Science and Railway Static GK intuitive, memorable, and high-scoring.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      rating: 4.8
    },
    modules: [
      {
        id: 'mod-2-1',
        courseId: 'course-2',
        title: 'Module 1 — Physics for Railway Exams (NCERT Core)',
        order: 1,
        lectures: [
          {
            id: 'lec-2-1-1',
            moduleId: 'mod-2-1',
            courseId: 'course-2',
            title: 'Lecture 1 — Units, Dimensions & Measurement Systems',
            order: 1,
            duration: '35:40',
            durationSeconds: 2140,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'SI units, derived units, dimensional formulas, and standard railway exam trick questions.'
          },
          {
            id: 'lec-2-1-2',
            moduleId: 'mod-2-1',
            courseId: 'course-2',
            title: 'Lecture 2 — Newton’s Laws of Motion & Momentum Numericals',
            order: 2,
            duration: '40:15',
            durationSeconds: 2415,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'First, second, and third laws of motion, inertia, friction applications, and solved numericals.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-2-1',
        courseId: 'course-2',
        title: 'NCERT Class 9 & 10 Physics 200 One-Liners (Quick Revision Sheet)',
        chapter: 'General Science',
        fileSize: '5.1 MB',
        isPaid: true,
        fileUrl: '/notes/railway-science-oneliners.pdf',
        downloadCount: 4200
      },
      {
        id: 'note-2-2',
        courseId: 'course-2',
        title: 'Railway Maths Formula Handbook with Vedic Math Tricks',
        chapter: 'Mathematics',
        fileSize: '3.9 MB',
        isPaid: true,
        fileUrl: '/notes/railway-maths-formulae.pdf',
        downloadCount: 3800
      }
    ],
    liveClasses: [
      {
        id: 'live-2-1',
        courseId: 'course-2',
        courseTitle: 'Railway Group D Complete Preparation',
        topic: 'Speed, Time & Distance Train Problems — 10 Second Shortcut Tricks',
        instructorName: 'Dr. Vikas Kumar Verma',
        date: 'Thursday',
        time: '8:30 PM IST',
        duration: '60 Mins',
        isLiveNow: false,
        meetingUrl: 'https://meet.google.com/demo-studyway-railway'
      }
    ]
  },
  {
    id: 'course-3',
    slug: 'ssc-maths-complete-course',
    title: 'SSC Maths Complete Course (Arithmetic + Advanced Mathematics)',
    category: 'SSC & Gov',
    type: 'recorded',
    status: 'published',
    isFeatured: true,
    badgeText: 'BESTSELLER • FULL SYLLABUS',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 5120,
    studentsEnrolled: 16800,
    duration: '180+ Hours',
    validityMonths: 24,
    totalVideos: 72,
    totalNotes: 38,
    originalPrice: 2499,
    discountedPrice: 899,
    description: 'Master quantitative aptitude from scratch to advanced level for SSC CGL, CHSL, MTS, CPO, and State Selection Boards. Zero-formula intuitive logic, Vedic shortcuts, and 100% question coverage with step-by-step video solutions.',
    whatYouWillLearn: [
      'Arithmetic: Percentages, Profit & Loss, SI & CI, Ratio, Time & Work, Pipes & Cisterns',
      'Advanced: Algebra, Trigonometry, Heights & Distances, Geometry, Mensuration 2D/3D',
      'Speed calculation techniques to solve 25 questions in under 18 minutes',
      'TCS latest pattern questions from 2020 to 2025 solved with multiple approaches'
    ],
    features: [
      'Comprehensive 72 Chapter Video Lectures in Ultra HD with multi-quality support',
      'Topic-wise Level 1, Level 2, Level 3 practice sheets with answer keys',
      'Doubt clarification forum with peer and mentor support'
    ],
    requirements: [
      'Any student targeting government exams who wants to eliminate fear of math',
      'Notebook and pen for daily problem solving'
    ],
    instructor: {
      id: 'inst-3',
      name: 'Anand Mishra',
      title: 'Quantitative Aptitude Mentor & SSC CGL 2019 Ranker',
      experience: '9+ Years Experience',
      bio: 'Anand Mishra scored 198/200 in SSC CGL Quant Mains and has mentored over 30,000 students into central government ministries and inspector posts.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    modules: [
      {
        id: 'mod-3-1',
        courseId: 'course-3',
        title: 'Module 1 — Calculation Speed & Number System',
        order: 1,
        lectures: [
          {
            id: 'lec-3-1-1',
            moduleId: 'mod-3-1',
            courseId: 'course-3',
            title: 'Lecture 1 — Fast Vedic Multiplication, Square Roots & Cube Roots',
            order: 1,
            duration: '45:10',
            durationSeconds: 2710,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'Speed calculation masterclass to boost raw arithmetic multiplication by 3x.'
          },
          {
            id: 'lec-3-1-2',
            moduleId: 'mod-3-1',
            courseId: 'course-3',
            title: 'Lecture 2 — Divisibility Rules & Remainder Theorem',
            order: 2,
            duration: '50:20',
            durationSeconds: 3020,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            availableQualities: ['360p', '480p', '720p', '1080p'],
            summary: 'Euler’s theorem, Wilson’s theorem, cyclicity of unit digits, and algebraic remainders.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-3-1',
        courseId: 'course-3',
        title: 'Class Handwritten Notes — Percentage & Fraction Equivalence Chart',
        chapter: 'Arithmetic',
        fileSize: '3.4 MB',
        isPaid: true,
        fileUrl: '/notes/ssc-maths-percentage.pdf',
        downloadCount: 5100
      }
    ],
    liveClasses: []
  },
  {
    id: 'course-4',
    slug: 'basic-computer-course-ccc',
    title: 'Basic Computer Course & CCC Certificate Preparation (Hindi+English)',
    category: 'Skill Development',
    type: 'recorded',
    status: 'published',
    isFeatured: false,
    badgeText: 'JOB READY • PRACTICAL',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 1650,
    studentsEnrolled: 6200,
    duration: '60+ Hours',
    validityMonths: 6,
    totalVideos: 30,
    totalNotes: 18,
    originalPrice: 999,
    discountedPrice: 399,
    description: 'Learn practical computer operations essential for government jobs, clerical examinations, and office employment. Includes Windows, MS Office (Word, Excel, PowerPoint), LibreOffice Writer/Calc/Impress, Internet, Email, Cyber Security, and Digital Financial Services.',
    whatYouWillLearn: [
      'Hardware basics, operating system navigation, file management in Windows 10/11',
      'Advanced MS Excel formulas (VLOOKUP, SUMIFS, Pivot Tables, Charts)',
      'Professional document formatting, mail merge, and official letter drafting in MS Word',
      'Cyber security best practices, UPI safety, and digital locker usage',
      '100% NIELIT CCC exam syllabus with 1,000+ bilingual practice MCQs'
    ],
    features: [
      'Step-by-step screen recordings with practical examples',
      'Keyboard shortcut sheets and official template bundles',
      'Course Completion Certificate for resume enhancement'
    ],
    requirements: [
      'No prior computer background required. Starts from ABC of computers.',
      'A PC/Laptop or smartphone to watch and practice'
    ],
    instructor: {
      id: 'inst-4',
      name: 'Priya Sen',
      title: 'Senior IT Trainer & Certified Microsoft Specialist',
      experience: '8+ Years Experience',
      bio: 'Priya Sen has trained over 18,000 students in practical corporate IT, Excel data management, and CCC certification.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      rating: 4.8
    },
    modules: [
      {
        id: 'mod-4-1',
        courseId: 'course-4',
        title: 'Module 1 — Computer Fundamentals & Operating Systems',
        order: 1,
        lectures: [
          {
            id: 'lec-4-1-1',
            moduleId: 'mod-4-1',
            courseId: 'course-4',
            title: 'Lecture 1 — Computer Generations, CPU Architecture & Memory Types',
            order: 1,
            duration: '26:45',
            durationSeconds: 1605,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Understanding RAM, ROM, SSD, HDD, CPU clock speed, ports, and peripheral devices.'
          },
          {
            id: 'lec-4-1-2',
            moduleId: 'mod-4-1',
            courseId: 'course-4',
            title: 'Lecture 2 — Windows Operating System & Shortcut Mastery',
            order: 2,
            duration: '31:10',
            durationSeconds: 1870,
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Folder structures, Task Manager, Control Panel, device drivers, and shortcut keys.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-4-1',
        courseId: 'course-4',
        title: 'MS Excel 100 Most Used Formulas with Syntax & Practical Examples',
        chapter: 'Office Tools',
        fileSize: '4.8 MB',
        isPaid: true,
        fileUrl: '/notes/excel-formula-cheatsheet.pdf',
        downloadCount: 2900
      }
    ],
    liveClasses: []
  },
  {
    id: 'course-5',
    slug: 'english-speaking-course-communication-skills',
    title: 'English Speaking & Personality Development for Job Interviews',
    category: 'Skill Development',
    type: 'live',
    status: 'published',
    isFeatured: false,
    badgeText: 'FLUENCY • INTERVIEW READY',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 1980,
    studentsEnrolled: 5400,
    duration: '80+ Hours',
    validityMonths: 6,
    totalVideos: 36,
    totalNotes: 20,
    originalPrice: 1499,
    discountedPrice: 599,
    description: 'Transform your spoken English from hesitation to confidence. Specially designed for Hindi medium students preparing for government job interviews, private sector jobs, railway document verification, and everyday professional workplace conversations.',
    whatYouWillLearn: [
      'Overcome hesitation and grammar fear through conversational sentence patterns',
      'Daily vocabulary, idioms, phrases, and correct Indian-accent pronunciation',
      'Self-introduction master templates for job interviews and group discussions',
      'Professional telephone and email etiquette'
    ],
    features: [
      'Weekly live speaking practice sessions in small breakout groups',
      'Daily audio flashcards for pronunciation practice',
      'Mock interview simulations with personalized feedback'
    ],
    requirements: [
      'Willingness to speak out loud and practice 20 minutes daily',
      'Basic knowledge of English alphabet and elementary words'
    ],
    instructor: {
      id: 'inst-5',
      name: 'Neha Kapoor',
      title: 'Corporate Verbal Coach & Soft Skills Trainer',
      experience: '7+ Years Experience',
      bio: 'Neha Kapoor has coached over 12,000 students from tier-2 and tier-3 towns to communicate clearly and crack high-stakes interviews.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    modules: [
      {
        id: 'mod-5-1',
        courseId: 'course-5',
        title: 'Module 1 — Sentence Construction Without Grammar Confusion',
        order: 1,
        lectures: [
          {
            id: 'lec-5-1-1',
            moduleId: 'mod-5-1',
            courseId: 'course-5',
            title: 'Lecture 1 — The 5 Core Sentence Patterns for Daily Conversation',
            order: 1,
            duration: '29:50',
            durationSeconds: 1790,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Subject-Verb-Object formula and transitioning from Hindi thinking to English speaking.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-5-1',
        courseId: 'course-5',
        title: '1,000 Daily Use English Sentences with Hindi Meaning and Audio Cues',
        chapter: 'Conversation',
        fileSize: '6.2 MB',
        isPaid: true,
        fileUrl: '/notes/1000-daily-english-sentences.pdf',
        downloadCount: 3400
      }
    ],
    liveClasses: [
      {
        id: 'live-5-1',
        courseId: 'course-5',
        courseTitle: 'English Speaking & Personality Development',
        topic: 'Live Speaking Drill: Answering "Tell Me About Yourself" in Interviews',
        instructorName: 'Neha Kapoor',
        date: 'Friday',
        time: '6:00 PM IST',
        duration: '60 Mins',
        isLiveNow: false,
        meetingUrl: 'https://meet.google.com/demo-studyway-english'
      }
    ]
  },
  {
    id: 'course-6',
    slug: 'general-knowledge-current-affairs-masterclass',
    title: 'General Knowledge & Current Affairs Masterclass 2026',
    category: 'SSC & Gov',
    type: 'live',
    status: 'published',
    isFeatured: false,
    badgeText: 'UPDATED DAILY • STATIC GK',
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 2210,
    studentsEnrolled: 9400,
    duration: '140+ Hours',
    validityMonths: 12,
    totalVideos: 52,
    totalNotes: 40,
    originalPrice: 1299,
    discountedPrice: 499,
    description: 'The ultimate bilingual GK batch for Railway, SSC, Police, Army, ITI Technician, and State PSC exams. Covers Indian History, Geography, Polity, Economics, Science & Technology, Sports, Awards, and National/International Current Affairs.',
    whatYouWillLearn: [
      'Indian Constitution & Polity with important articles, amendments and schedules',
      'Physical, economic, and political geography of India (rivers, dams, passes, minerals)',
      'Modern Indian History, freedom movement, and important socio-religious movements',
      'Daily 8:00 AM Current Affairs analysis with exam-oriented MCQ roundups'
    ],
    features: [
      'Monthly GK Magazines in clean printable PDF format',
      'Mind maps for rapid revision before exams',
      'Weekly Sunday Mega Live Quiz with leaderboards'
    ],
    requirements: [
      'Basic interest in general awareness and daily news'
    ],
    instructor: {
      id: 'inst-6',
      name: 'Rajesh Kumar Upadhyay',
      title: 'Senior GS Faculty & UPSC CSE Interview Faced',
      experience: '13+ Years Experience',
      bio: 'Rajesh Upadhyay is acclaimed for his story-telling approach that makes Indian history and geography effortless to recall during exams.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      rating: 4.8
    },
    modules: [
      {
        id: 'mod-6-1',
        courseId: 'course-6',
        title: 'Module 1 — Indian Polity & Constitution Fundamentals',
        order: 1,
        lectures: [
          {
            id: 'lec-6-1-1',
            moduleId: 'mod-6-1',
            courseId: 'course-6',
            title: 'Lecture 1 — Making of the Constitution & Preamble Breakdown',
            order: 1,
            duration: '38:15',
            durationSeconds: 2295,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Constituent Assembly debates, drafting committee, sovereign socialist secular democratic republic.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-6-1',
        courseId: 'course-6',
        title: 'Important Indian Constitutional Articles & Amendments Quick Reference Table',
        chapter: 'Polity',
        fileSize: '4.1 MB',
        isPaid: true,
        fileUrl: '/notes/indian-polity-articles.pdf',
        downloadCount: 4600
      }
    ],
    liveClasses: [
      {
        id: 'live-6-1',
        courseId: 'course-6',
        courseTitle: 'General Knowledge & Current Affairs Masterclass',
        topic: 'Union Budget 2026 & Economic Survey Key Takeaways for Gov Exams',
        instructorName: 'Rajesh Kumar Upadhyay',
        date: 'Saturday',
        time: '9:00 AM IST',
        duration: '90 Mins',
        isLiveNow: false,
        meetingUrl: 'https://meet.google.com/demo-studyway-gk'
      }
    ]
  },
  {
    id: 'course-7',
    slug: 'reasoning-masterclass-competitive-exams',
    title: 'Reasoning Masterclass for Competitive Exams (Verbal + Non-Verbal)',
    category: 'Railway Exams',
    type: 'recorded',
    status: 'published',
    isFeatured: false,
    badgeText: 'HIGH SCORING • SHORTCUTS',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 2840,
    studentsEnrolled: 8100,
    duration: '110+ Hours',
    validityMonths: 12,
    totalVideos: 44,
    totalNotes: 22,
    originalPrice: 1599,
    discountedPrice: 549,
    description: 'Score 100% marks in General Intelligence & Reasoning. Master Syllogism, Blood Relations, Coding-Decoding, Seating Arrangements, Puzzles, Statement & Assumptions, Series, and Visual Pattern matching.',
    whatYouWillLearn: [
      'Venn diagram approach for 100% error-free Syllogisms in 15 seconds',
      'Family tree mapping for complex Blood Relation coded puzzles',
      'Clock & Calendar formulas and leap year problem solving',
      'Cube folding, paper cutting, and mirror/water image non-verbal mastery'
    ],
    features: [
      'Concept videos + 50 solved questions per topic',
      'Speed quiz timers on every practice section'
    ],
    requirements: [
      'Targeting Railway, SSC, Police, Banking, or Defense exams'
    ],
    instructor: {
      id: 'inst-7',
      name: 'Sandeep Rawat',
      title: 'Reasoning Specialist & Author',
      experience: '10+ Years Experience',
      bio: 'Sandeep Rawat has trained over 25,000 candidates with logical reasoning techniques that eliminate the need for pen and paper.',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      rating: 4.9
    },
    modules: [
      {
        id: 'mod-7-1',
        courseId: 'course-7',
        title: 'Module 1 — Coding-Decoding & Analogy Mastery',
        order: 1,
        lectures: [
          {
            id: 'lec-7-1-1',
            moduleId: 'mod-7-1',
            courseId: 'course-7',
            title: 'Lecture 1 — Alphabet Position Memorization & Opposite Pairs Tricks',
            order: 1,
            duration: '27:10',
            durationSeconds: 1630,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'EJOTY formula, reverse rank calculation, and letter shift decoding patterns.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-7-1',
        courseId: 'course-7',
        title: 'Top 300 Syllogism & Seating Arrangement High-Level Questions',
        chapter: 'Reasoning Practice',
        fileSize: '5.6 MB',
        isPaid: true,
        fileUrl: '/notes/reasoning-top-300-questions.pdf',
        downloadCount: 3900
      }
    ],
    liveClasses: []
  },
  {
    id: 'course-8',
    slug: 'employability-skills-workshop-calculation-iti',
    title: 'Employability Skills & Workshop Science for ITI Apprenticeships',
    category: 'ITI Technical',
    type: 'recorded',
    status: 'published',
    isFeatured: false,
    badgeText: 'NCVT APPROVED • DGT SYLLABUS',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 1420,
    studentsEnrolled: 5100,
    duration: '70+ Hours',
    validityMonths: 12,
    totalVideos: 32,
    totalNotes: 16,
    originalPrice: 1199,
    discountedPrice: 449,
    description: 'Mandatory paper preparation for all ITI trades (Fitter, Turner, Machinist, Welder, Electrician, Diesel Mechanic, COPA). Aligned with DGT latest NSQF Level 4 & 5 curriculum.',
    whatYouWillLearn: [
      'Constitutional values, 21st century workplace communication, digital literacy',
      'Occupational health, safety, environmental education, and first aid procedures',
      'Workshop Calculation & Science: Friction, Heat & Temperature, Levers, Elasticity',
      'Apprenticeship portal registration (NAPS) and interview readiness'
    ],
    features: [
      'DGT NIMI approved question bank coverage',
      'Chapter-wise mock CBT tests with answer explanations'
    ],
    requirements: [
      'ITI student of any engineering or non-engineering trade'
    ],
    instructor: {
      id: 'inst-8',
      name: 'Er. Suresh Patel',
      title: 'Senior NCVT Certified Technical Instructor',
      experience: '12+ Years Experience',
      bio: 'Er. Suresh Patel specializes in technical vocational education and apprenticeship guidance for Indian youth.',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      rating: 4.7
    },
    modules: [
      {
        id: 'mod-8-1',
        courseId: 'course-8',
        title: 'Module 1 — Occupational Safety, Health & First Aid',
        order: 1,
        lectures: [
          {
            id: 'lec-8-1-1',
            moduleId: 'mod-8-1',
            courseId: 'course-8',
            title: 'Lecture 1 — Industrial Safety, 5S Concept & Fire Extinguisher Types',
            order: 1,
            duration: '30:45',
            durationSeconds: 1845,
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            availableQualities: ['360p', '480p', '720p'],
            summary: 'Color codes, PPE safety equipment, 5S Japanese workplace organization, and fire classification.'
          }
        ]
      }
    ],
    notes: [
      {
        id: 'note-8-1',
        courseId: 'course-8',
        title: 'Workshop Calculation & Science Formula Sheet with Solved NIMI Examples',
        chapter: 'Workshop Science',
        fileSize: '4.4 MB',
        isPaid: true,
        fileUrl: '/notes/workshop-calculation-notes.pdf',
        downloadCount: 2300
      }
    ],
    liveClasses: []
  }
];
