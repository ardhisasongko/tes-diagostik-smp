import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Printer, 
  Share2, 
  Sparkles, 
  X, 
  Headphones, 
  PenTool, 
  MessageSquare, 
  Award,
  ArrowRight
} from 'lucide-react';
import { StudentRecord } from '../types';

interface DiagnosticReportCardProps {
  student: StudentRecord;
  onClose?: () => void;
  onPrint?: () => void;
}

export const DiagnosticReportCard: React.FC<DiagnosticReportCardProps> = ({
  student,
  onClose,
  onPrint
}) => {
  const [copied, setCopied] = useState(false);
  const evalData = student.evaluation;

  if (!evalData) {
    return (
      <div className="p-6 text-center text-slate-500">
        Data evaluasi belum tersedia untuk siswa ini.
      </div>
    );
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(evalData.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierBadgeClass = (color: string) => {
    if (color === '🟩') return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
    if (color === '🟨') return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300';
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-4xl mx-auto space-y-0 p-6 md:p-8">
      {/* Report Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 dark:border-slate-800 gap-4 relative">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>SMP PLUS AT-THAHIRIN • English Diagnostic Evaluation (Class 9)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {student.studentName}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Kelas: <span className="font-bold text-slate-700 dark:text-slate-300">{student.className || '9A'}</span> • Tanggal Evaluasi: {new Date(evalData.evaluatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onPrint || (() => window.print())}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 transition shadow-sm flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        {/* Listening Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Headphones className="w-6 h-6" />
            </div>
            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase ${getTierBadgeClass(evalData.listeningColor)}`}>
              {evalData.listeningColor} Listening
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">🎧 Menyimak Kata Kunci</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
            {evalData.listeningReason}
          </p>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-medium">
            Terkumpul: <span className="font-bold text-indigo-600 dark:text-indigo-400">{student.listeningData.selectedKeywords.length}/9 kata kunci</span>
          </div>
        </div>

        {/* Writing Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl">
              <PenTool className="w-6 h-6" />
            </div>
            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase ${getTierBadgeClass(evalData.writingColor)}`}>
              {evalData.writingColor} Writing
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">✍️ Menulis (5 Kalimat)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
            {evalData.writingReason}
          </p>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 italic truncate" title={student.writingData.text}>
            "{student.writingData.text || 'Tidak ada catatan'}"
          </div>
        </div>

        {/* Speaking Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase ${getTierBadgeClass(evalData.speakingColor)}`}>
              {evalData.speakingColor} Speaking
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">🗣️ Observasi Berbicara</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
            {evalData.speakingReason}
          </p>
          <div className="flex flex-wrap gap-1">
            {student.speakingObs.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bento Summary & Follow-Up Hero Card (Spans 3 Columns) */}
        <div className="md:col-span-3 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[32px] p-6 sm:p-8 text-white flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between relative overflow-hidden shadow-xl border border-indigo-500/20">
          <div className="flex-shrink-0 space-y-3">
            <p className="text-indigo-300 text-xs font-extrabold uppercase tracking-widest">
              Level Keseluruhan Siswa
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-400 rounded-2xl flex items-center justify-center text-indigo-950 font-black text-2xl shadow-lg">
                {evalData.overallColor}
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {evalData.overallLevel}
                </h2>
                <p className="text-indigo-200 text-xs opacity-90">
                  Capaian hasil asesmen diagnostik awal 15 menit
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full lg:h-28 lg:w-px bg-indigo-800/80 my-2 lg:my-0"></div>

          <div className="flex-1 space-y-3">
            <p className="text-indigo-300 text-xs font-extrabold uppercase tracking-widest">
              Rencana Tindak Lanjut Pembelajaran Berdiferensiasi
            </p>
            <div className="p-4 bg-indigo-900/60 rounded-2xl border border-indigo-700/50">
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
                {evalData.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Markdown Export & Actions */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Status: Evaluasi {evalData.isAiEvaluated ? 'Google Gemini AI' : 'Manual Guru'}</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleCopyMarkdown}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Markdown Tersalin!' : 'Salin Text Format Laporan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
