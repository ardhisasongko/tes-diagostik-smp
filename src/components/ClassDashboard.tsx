import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  HelpCircle, 
  AlertTriangle, 
  UserCheck, 
  BookOpen, 
  HeartHandshake, 
  ArrowUpRight,
  Headphones,
  PenTool,
  MessageSquare,
  Play
} from 'lucide-react';
import { StudentRecord, CLASS_OPTIONS } from '../types';

interface ClassDashboardProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onBatchEvaluate: () => void;
  isBatchEvaluating: boolean;
  onNavigateToForm: () => void;
}

export const ClassDashboard: React.FC<ClassDashboardProps> = ({
  students,
  onSelectStudent,
  onBatchEvaluate,
  isBatchEvaluating,
  onNavigateToForm
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Hanya hitung untuk kelas yang dipilih agar data tidak tercampur
  const isClassMatch = (s: StudentRecord) =>
    selectedClass === 'ALL' || (s.className || '9A') === selectedClass;

  const total = students.filter(isClassMatch).length;
  const evaluatedStudents = students.filter(s => isClassMatch(s) && s.status === 'evaluated' && s.evaluation);
  const pendingStudents = students.filter(s => isClassMatch(s) && (s.status === 'pending' || !s.evaluation));

  const greenStudents = evaluatedStudents.filter(s => s.evaluation?.overallColor === '🟩');
  const yellowStudents = evaluatedStudents.filter(s => s.evaluation?.overallColor === '🟨');
  const redStudents = evaluatedStudents.filter(s => s.evaluation?.overallColor === '🟥');

  const greenPercent = total > 0 ? Math.round((greenStudents.length / total) * 100) : 0;
  const yellowPercent = total > 0 ? Math.round((yellowStudents.length / total) * 100) : 0;
  const redPercent = total > 0 ? Math.round((redStudents.length / total) * 100) : 0;

  // Aspect breakdown counters
  const listeningGreen = evaluatedStudents.filter(s => s.evaluation?.listeningColor === '🟩').length;
  const listeningYellow = evaluatedStudents.filter(s => s.evaluation?.listeningColor === '🟨').length;
  const listeningRed = evaluatedStudents.filter(s => s.evaluation?.listeningColor === '🟥').length;

  const writingGreen = evaluatedStudents.filter(s => s.evaluation?.writingColor === '🟩').length;
  const writingYellow = evaluatedStudents.filter(s => s.evaluation?.writingColor === '🟨').length;
  const writingRed = evaluatedStudents.filter(s => s.evaluation?.writingColor === '🟥').length;

  const speakingGreen = evaluatedStudents.filter(s => s.evaluation?.speakingColor === '🟩').length;
  const speakingYellow = evaluatedStudents.filter(s => s.evaluation?.speakingColor === '🟨').length;
  const speakingRed = evaluatedStudents.filter(s => s.evaluation?.speakingColor === '🟥').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions - Hero Bento Block */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-[32px] border border-indigo-500/20 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" /> SMP PLUS AT-THAHIRIN • Pembelajaran Berdiferensiasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Diagnostik Kelas {selectedClass === 'ALL' ? 'Semua' : selectedClass}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Total <span className="font-bold text-white">{total}</span> Siswa Terdaftar • <span className="font-bold text-emerald-400">{evaluatedStudents.length}</span> Siswa Ter-evaluasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          {pendingStudents.length > 0 && (
            <button
              onClick={onBatchEvaluate}
              disabled={isBatchEvaluating}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isBatchEvaluating ? 'Proses Evaluasi AI...' : `Evaluasi AI ${pendingStudents.length} Siswa Pending`}</span>
            </button>
          )}

          <button
            onClick={onNavigateToForm}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center space-x-2"
          >
            <span>+ Input Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Kelas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Filter Kelas:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedClass('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedClass === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua Kelas ({students.length})
          </button>
          {CLASS_OPTIONS.map((cls) => {
            const count = students.filter(s => (s.className || '9A') === cls).length;
            if (count === 0) return null;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedClass === cls
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cls} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Metric Cards - Bento Grid 4-Cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Evaluasi</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {evaluatedStudents.length} <span className="text-xs font-medium text-slate-400">/ {total}</span>
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              {pendingStudents.length} siswa perlu evaluasi
            </p>
          </div>
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Hijau Mahir */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">
              <span>🟩 Hijau (Mahir)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-200">
              {greenStudents.length} <span className="text-xs font-normal text-emerald-600">({greenPercent}%)</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Kelompok Peer-Tutor
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Kuning Berkembang */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-amber-200 dark:border-amber-950 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-amber-700 dark:text-amber-400 font-extrabold uppercase">
              <span>🟨 Kuning (Berkembang)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-200">
              {yellowStudents.length} <span className="text-xs font-normal text-amber-600">({yellowPercent}%)</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              Scaffolding Tambahan
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Merah Perlu Bimbingan */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-rose-200 dark:border-rose-950 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-rose-700 dark:text-rose-400 font-extrabold uppercase">
              <span>🟥 Merah (Bimbingan)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-900 dark:text-rose-200">
              {redStudents.length} <span className="text-xs font-normal text-rose-600">({redPercent}%)</span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
              Pendampingan Intensif
            </p>
          </div>
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-2xl">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3 GROUPINGS FOR DIFFERENTIATED LEARNING */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Pemetaan Kelompok Belajar Berdiferensiasi</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GROUP 1: MAHIR */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-950">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🟩</span>
                  <div>
                    <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">
                      Kelompok Pengayaan & Peer Tutor
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                      Level: Mahir ({greenStudents.length} Siswa)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200/50 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                <span className="font-bold block">Tindak Lanjut Pembelajaran:</span>
                <p className="leading-relaxed">
                  Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & perankan siswa sebagai peer-tutor.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daftar Siswa ({greenStudents.length}):
                </span>
                {greenStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada siswa di kelompok ini.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {greenStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => onSelectStudent(student)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition border border-slate-100 dark:border-slate-700 flex items-center justify-between group text-xs"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {student.studentName}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 2: BERKEMBANG */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100 dark:border-amber-950">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🟨</span>
                  <div>
                    <h4 className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">
                      Kelompok Scaffolding Tambahan
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                      Level: Berkembang ({yellowStudents.length} Siswa)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200/50 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                <span className="font-bold block">Tindak Lanjut Pembelajaran:</span>
                <p className="leading-relaxed">
                  Berikan scaffolding tambahan (contoh nyata, kosakata bergambar, latihan berulang) sebelum materi baru.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daftar Siswa ({yellowStudents.length}):
                </span>
                {yellowStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada siswa di kelompok ini.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {yellowStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => onSelectStudent(student)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition border border-slate-100 dark:border-slate-700 flex items-center justify-between group text-xs"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {student.studentName}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 3: PERLU BIMBINGAN */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🟥</span>
                  <div>
                    <h4 className="font-extrabold text-rose-900 dark:text-rose-200 text-sm">
                      Kelompok Pendampingan Intensif
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400 font-bold">
                      Level: Perlu Bimbingan ({redStudents.length} Siswa)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-2xl border border-rose-200/50 text-xs text-rose-900 dark:text-rose-300 space-y-1">
                <span className="font-bold block">Tindak Lanjut Pembelajaran:</span>
                <p className="leading-relaxed">
                  Rencanakan pendampingan individu/kelompok kecil & komunikasikan dengan orang tua/wali kelas.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daftar Siswa ({redStudents.length}):
                </span>
                {redStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada siswa di kelompok ini.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {redStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => onSelectStudent(student)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition border border-slate-100 dark:border-slate-700 flex items-center justify-between group text-xs"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {student.studentName}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ASPECT COMPARISON BARS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Distribusi Capaian Per-Aspek Keterampilan Bahasa Inggris
        </h3>

        <div className="space-y-4">
          {/* Listening Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-indigo-600" /> Listening (Menyimak Kata Kunci)
              </span>
              <span>
                🟩 {listeningGreen} | 🟨 {listeningYellow} | 🟥 {listeningRed}
              </span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${evaluatedStudents.length > 0 ? (listeningGreen / evaluatedStudents.length) * 100 : 0}%` }} className="bg-emerald-500 h-full" title="Hijau (Mahir)" />
              <div style={{ width: `${evaluatedStudents.length > 0 ? (listeningYellow / evaluatedStudents.length) * 100 : 0}%` }} className="bg-amber-400 h-full" title="Kuning (Berkembang)" />
              <div style={{ width: `${evaluatedStudents.length > 0 ? (listeningRed / evaluatedStudents.length) * 100 : 0}%` }} className="bg-rose-500 h-full" title="Merah (Perlu Bimbingan)" />
            </div>
          </div>

          {/* Writing Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-emerald-600" /> Writing (Menulis 5 Kalimat)
              </span>
              <span>
                🟩 {writingGreen} | 🟨 {writingYellow} | 🟥 {writingRed}
              </span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${evaluatedStudents.length > 0 ? (writingGreen / evaluatedStudents.length) * 100 : 0}%` }} className="bg-emerald-500 h-full" title="Hijau (Mahir)" />
              <div style={{ width: `${evaluatedStudents.length > 0 ? (writingYellow / evaluatedStudents.length) * 100 : 0}%` }} className="bg-amber-400 h-full" title="Kuning (Berkembang)" />
              <div style={{ width: `${evaluatedStudents.length > 0 ? (writingRed / evaluatedStudents.length) * 100 : 0}%` }} className="bg-rose-500 h-full" title="Merah (Perlu Bimbingan)" />
            </div>
          </div>

          {/* Speaking Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" /> Speaking (Observasi Berbicara)
              </span>
              <span>
                🟩 {speakingGreen} | 🟨 {speakingYellow} | 🟥 {speakingRed}
              </span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${evaluatedStudents.length > 0 ? (speakingGreen / evaluatedStudents.length) * 100 : 0}%` }} className="bg-emerald-500 h-full" title="Hijau (Mahir)" />
              <div style={{ width: `${evaluatedStudents.length > 0 ? (speakingYellow / evaluatedStudents.length) * 100 : 0}%` }} className="bg-amber-400 h-full" title="Kuning (Berkembang)" />
              <div style={{ width: `${evaluatedStudents.length > 0 ? (speakingRed / evaluatedStudents.length) * 100 : 0}%` }} className="bg-rose-500 h-full" title="Merah (Perlu Bimbingan)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
