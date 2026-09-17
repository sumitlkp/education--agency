import React from 'react';
import { Certificate } from '../../types.ts';
import { Logo } from '../common/Logo.tsx';
import { X, Award, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border & Content */}
        <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border-4 border-amber-500/60 shadow-inner text-center overflow-hidden">
          {/* Subtle Guilloche Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            <Award className="w-96 h-96 text-amber-500" />
          </div>

          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Logo size="md" showTagline={false} />
            </div>

            <div className="uppercase tracking-widest text-xs font-bold text-amber-400">
              National Skill & Exam Training Council
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              CERTIFICATE OF COMPLETION
            </h2>

            <p className="text-xs text-slate-400">This is to officially certify that</p>

            {/* Student Name */}
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-serif border-b-2 border-amber-500/30 pb-2 max-w-md mx-auto">
              {certificate.studentName}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              has successfully completed 100% of the curriculum, practical problem-solving modules, and syllabus assessments for the verified course:
            </p>

            {/* Course Name */}
            <div className="text-lg font-bold text-white px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/60 inline-block max-w-xl">
              {certificate.courseTitle}
            </div>

            {/* Verification Details */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400 max-w-lg mx-auto text-left">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Issue Date</span>
                <span className="text-slate-200 font-semibold">{certificate.issuedDate}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Verification ID</span>
                <span className="font-mono text-amber-400 text-[11px] font-bold">{certificate.certificateNumber}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Instructor Sign</span>
                <span className="text-slate-200 font-serif italic">{certificate.instructorName}</span>
              </div>
            </div>

            {/* Verified badge */}
            <div className="pt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Digital Credential • StudyWay India</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Certificate ID: <strong className="text-slate-200">{certificate.certificateNumber}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              Print Certificate
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Download High-Res PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
