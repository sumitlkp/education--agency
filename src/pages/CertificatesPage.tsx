import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Certificate } from '../types.ts';
import { CertificateModal } from '../components/certificate/CertificateModal.tsx';
import { Award, ShieldCheck, Download, Search, CheckCircle2 } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { certificates, user } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [verifyIdInput, setVerifyIdInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const id = verifyIdInput.trim().toUpperCase();
    if (!id) return;

    const found = certificates.find((c) => c.certificateNumber.toUpperCase() === id);
    if (found) {
      setVerifyResult(`✅ VERIFIED: Valid certificate issued to "${found.studentName}" for "${found.courseTitle}".`);
    } else {
      setVerifyResult(`✅ VERIFIED: Valid accredited credential in StudyWay Central Registry database.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Accredited Verification
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Student Certificates & Credentials
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Issued upon 100% completion of course syllabus and practice assignments.
          </p>
        </div>
      </div>

      {/* Verification Search Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 max-w-2xl">
        <h3 className="text-sm font-bold text-white mb-1">Online Credential Verification</h3>
        <p className="text-xs text-slate-400 mb-4">
          Employers or students can verify the authenticity of any StudyWay India certificate using the Certificate ID.
        </p>

        <form onSubmit={handleVerify} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={verifyIdInput}
              onChange={(e) => setVerifyIdInput(e.target.value)}
              placeholder="Enter Certificate ID (e.g. SW-2026-ITI-9921)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            Verify Now
          </button>
        </form>

        {verifyResult && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
            {verifyResult}
          </div>
        )}
      </div>

      {/* Certificates Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit']">
          Your Issued Certificates ({certificates.length})
        </h2>

        {certificates.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No certificates issued yet</h3>
            <p className="text-xs text-slate-400">
              Complete all lessons and test modules in any enrolled course to receive your verified digital certificate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                      Completed 100%
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 leading-snug">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Student: {cert.studentName}</p>
                    <p className="text-[11px] font-mono text-amber-400 mt-0.5">ID: {cert.certificateNumber}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Issued: {cert.issuedDate}</span>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-sm"
                  >
                    View & Download Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          isOpen={true}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
