import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Download, 
  Plus, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StudentRecord, LevelColor } from '../types';

interface StudentListTableProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (studentId: string) => void;
  onReevaluateAI: (student: StudentRecord) => void;
  onAddNewStudent: () => void;
  onExportCSV: () => void;
  isEvaluatingId?: string | null;
}

export const StudentListTable: React.FC<StudentListTableProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onReevaluateAI,
  onAddNewStudent,
  onExportCSV,
  isEvaluatingId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');

  // Filter students by search and tier
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.className && student.className.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTier === 'ALL') return true;
    if (filterTier === 'HIJAU') return student.evaluation?.overallColor === '🟩';
    if (filterTier === 'KUNING') return student.evaluation?.overallColor === '🟨';
    if (filterTier === 'MERAH') return student.evaluation?.overallColor === '🟥';
    if (filterTier === 'PENDING') return student.status === 'pending';

    return true;
  });

  const getBadgeClass = (color?: LevelColor) => {
    if (color === '🟩') return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 font-bold';
    if (color === '🟨') return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-bold';
    if (color === '🟥') return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 font-bold';
    return 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-5 p-6 sm:p-8">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Daftar Rekam Hasil Asesmen Siswa
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Kelola dan tinjau rekapitulasi data evaluasi diagnostik siswa
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onExportCSV}
            className="px-4 py-2.5 text-xs font-bold rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel/CSV</span>
          </button>

          <button
            onClick={onAddNewStudent}
            className="px-4 py-2.5 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Input Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Cari nama siswa atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Tier Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          <button
            onClick={() => setFilterTier('ALL')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filterTier === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua ({students.length})
          </button>

          <button
            onClick={() => setFilterTier('HIJAU')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filterTier === 'HIJAU'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            🟩 Mahir
          </button>

          <button
            onClick={() => setFilterTier('KUNING')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filterTier === 'KUNING'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            🟨 Berkembang
          </button>

          <button
            onClick={() => setFilterTier('MERAH')}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filterTier === 'MERAH'
                ? 'bg-rose-600 text-white'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            🟥 Perlu Bimbingan
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="p-3.5">Nama Siswa</th>
              <th className="p-3.5">Kelas</th>
              <th className="p-3.5">🎧 Listening</th>
              <th className="p-3.5">✍️ Writing</th>
              <th className="p-3.5">🗣️ Speaking</th>
              <th className="p-3.5">Level Keseluruhan</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Tidak ada data siswa yang sesuai filter.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const evalData = student.evaluation;
                const isEvaluating = isEvaluatingId === student.id;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {student.studentName}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {student.className || '9A'}
                    </td>
                    <td className="p-3.5">
                      {evalData ? (
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded border text-[11px] ${getBadgeClass(evalData.listeningColor)}`}>
                            {evalData.listeningColor}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[120px]" title={evalData.listeningReason}>
                            {student.listeningData.selectedKeywords.length}/9 kata
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {evalData ? (
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded border text-[11px] ${getBadgeClass(evalData.writingColor)}`}>
                            {evalData.writingColor}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {evalData ? (
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded border text-[11px] ${getBadgeClass(evalData.speakingColor)}`}>
                            {evalData.speakingColor}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {evalData ? (
                        <span className={`px-2.5 py-1 rounded-full border text-xs ${getBadgeClass(evalData.overallColor)}`}>
                          {evalData.overallColor} {evalData.overallLevel}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs">Belum Evaluasi</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      {evalData && (
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                          title="Lihat Rapor Hasil Analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onReevaluateAI(student)}
                        disabled={isEvaluating}
                        className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition disabled:opacity-50"
                        title="Evaluasi Ulang dengan Gemini AI"
                      >
                        <Sparkles className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={() => onEditStudent(student)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                        title="Edit Data Siswa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                        title="Hapus Data Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
