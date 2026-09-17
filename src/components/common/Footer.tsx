import React from 'react';
import { Logo } from './Logo.tsx';
import { Shield, Sparkles, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full bg-[#070a12] border-t border-slate-800/80 text-slate-400 text-sm mt-20 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => navigate('/')} className="inline-block">
              <Logo size="lg" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Your learning platform for courses, preparation and skills. Empowering Indian students, ITI technicians, Railway aspirants, and competitive job seekers with high-yield bilingual courses, handwritten notes, and live interactive mentorship.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NIMI & NCVT Syllabus</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Gov Exam Targeted 2026</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Verified Certificates</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Explore Batches</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-amber-400 transition-colors">
                  ITI Electrician Complete Batch
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-amber-400 transition-colors">
                  Railway Group D & RRB ALP
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-amber-400 transition-colors">
                  SSC Mathematics Masterclass
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-amber-400 transition-colors">
                  Basic Computer & CCC Preparation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/live')} className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Daily Live Classes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Student Corner</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-amber-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/certificates')} className="hover:text-amber-400 transition-colors">
                  Verify Certificates
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/favorites')} className="hover:text-amber-400 transition-colors">
                  Saved Favorites
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/orders')} className="hover:text-amber-400 transition-colors">
                  Purchase History & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-purple-400 hover:text-purple-300 transition-colors">
                  Admin Panel (Protected)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Policy & Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contact & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">support@studywayindia.in</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98765 43210 (10 AM - 7 PM)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs">Prayagraj & New Delhi, India</span>
              </li>
              <li className="pt-2 text-xs flex gap-3 text-slate-400">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span>•</span>
                <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
                <span>•</span>
                <span className="hover:text-white cursor-pointer">Refund Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Copyright © 2026 <span className="text-white font-semibold">StudyWay India</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Language: <strong className="text-slate-200">Hindi + English</strong></span>
            <span>Currency: <strong className="text-slate-200">₹ INR</strong></span>
            <span className="text-amber-400 font-medium">Learn Today • Prepare Better • Succeed Tomorrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
