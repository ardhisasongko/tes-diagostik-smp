import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { StudentForm } from './components/StudentForm';
import { ClassDashboard } from './components/ClassDashboard';
import { StudentListTable } from './components/StudentListTable';
import { RubricGuide } from './components/RubricGuide';
import { DiagnosticReportCard } from './components/DiagnosticReportCard';
import { SystemPromptModal } from './components/SystemPromptModal';
import { INITIAL_MOCK_STUDENTS } from './data/mockStudents';
import { 
  StudentRecord, 
  ListeningInput, 
  WritingInput, 
  SpeakingInput, 
  EvaluationResult 
} from './types';

const STORAGE_KEY = 'grade9_english_diagnostic_students_v1';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca localStorage:", e);
    }
    return INITIAL_MOCK_STUDENTS;
  });

  const [activeTab, setActiveTab] = useState<'student-portal' | 'form' | 'dashboard' | 'list' | 'rubric'>('dashboard');
  const [selectedStudentReport, setSelectedStudentReport] = useState<StudentRecord | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchEvaluating, setIsBatchEvaluating] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const [isEvaluatingId, setIsEvaluatingId] = useState<string | null>(null);

  // Student portal submission handler (Self-assessment)
  const handleStudentPortalSubmit = async (
    studentName: string,
    listeningData: ListeningInput,
    writingData: WritingInput,
    speakingObs: SpeakingInput,
    className?: string
  ) => {
    // Create new student record in pending status for teacher review/AI evaluation
    const newRecord: StudentRecord = {
      id: `std-${Date.now()}`,
      studentName,
      className: className || '9A',
      listeningData,
      writingData,
      speakingObs,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setStudents((prev) => [newRecord, ...prev]);

    // Save + evaluate on server so results are visible to the teacher on any device
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newRecord.id,
          studentName,
          className,
          listeningData,
          writingData,
          speakingObs,
          createdAt: newRecord.createdAt
        })
      });

      const rawText = await response.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Server merespons bukan JSON (HTTP ${response.status}). URL: ${window.location.origin} — pesan server: ${rawText.slice(0, 120)}`
        );
      }

      if (!data.success || !data.student) {
        throw new Error(data.error || 'Gagal mengevaluasi data siswa.');
      }

      const evaluated: StudentRecord = data.student;
      setStudents((prev) => prev.map((s) => (s.id === evaluated.id ? evaluated : s)));
    } catch (err: any) {
      alert(`Gagal menyimpan/evaluasi jawaban siswa: ${err.message}`);
    }
  };

  // Load shared records from server once on mount (merge with local)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data.success && Array.isArray(data.students) && data.students.length > 0) {
          setStudents((prev) => {
            const merged = new Map<string, StudentRecord>();
            for (const s of prev) merged.set(s.id, s);
            let changed = false;
            for (const s of data.students as StudentRecord[]) {
              const cur = merged.get(s.id);
              if (!cur || JSON.stringify(cur) !== JSON.stringify(s)) {
                merged.set(s.id, s);
                changed = true;
              }
            }
            return changed ? Array.from(merged.values()) : prev;
          });
        }
      } catch (e) {
        console.error("Gagal memuat data siswa dari server:", e);
      }
    })();
  }, []);

  // Save to localStorage + sync to server on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage:", e);
    }

    if (students.length === 0) return;
    const t = setTimeout(() => {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: students })
      }).catch((e) => console.error("Gagal sinkron data ke server:", e));
    }, 600);
    return () => clearTimeout(t);
  }, [students]);

  // Handle single AI evaluation
  const handleEvaluateAI = async (
    studentName: string,
    listeningData: ListeningInput,
    writingData: WritingInput,
    speakingObs: SpeakingInput,
    className?: string
  ) => {
    setIsLoading(true);

    // Format text inputs for API request
    const listeningDataText = `Dicentang ${listeningData.selectedKeywords.length} kata: ${listeningData.selectedKeywords.join(', ')}. Status pengulangan: ${listeningData.repetitionCount} kali. Catatan: ${listeningData.customNote || '-'}`;
    const writingDataText = writingData.text;
    const speakingObsText = `Tag: ${speakingObs.tags.join(', ')}. Catatan: ${speakingObs.customNote || '-'}`;

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          listeningData: listeningDataText,
          writingData: writingDataText,
          speakingObs: speakingObsText
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Gagal mengevaluasi data siswa.');
      }

      const evalResult: EvaluationResult = {
        listeningColor: data.listeningColor,
        listeningReason: data.listeningReason,
        writingColor: data.writingColor,
        writingReason: data.writingReason,
        speakingColor: data.speakingColor,
        speakingReason: data.speakingReason,
        overallColor: data.overallColor,
        overallLevel: data.overallLevel,
        recommendation: data.recommendation,
        markdown: data.markdown,
        evaluatedAt: new Date().toISOString(),
        isAiEvaluated: !data.isFallback
      };

      if (editingStudent) {
        // Update existing record
        const updatedRecord: StudentRecord = {
          ...editingStudent,
          studentName,
          className: className || '9A',
          listeningData,
          writingData,
          speakingObs,
          evaluation: evalResult,
          status: 'evaluated'
        };
        setStudents((prev) => prev.map((s) => (s.id === editingStudent.id ? updatedRecord : s)));
        setSelectedStudentReport(updatedRecord);
        setEditingStudent(null);
      } else {
        // Create new record
        const newRecord: StudentRecord = {
          id: `std-${Date.now()}`,
          studentName,
          className: className || '9A',
          listeningData,
          writingData,
          speakingObs,
          evaluation: evalResult,
          status: 'evaluated',
          createdAt: new Date().toISOString()
        };
        setStudents((prev) => [newRecord, ...prev]);
        setSelectedStudentReport(newRecord);
      }

    } catch (err: any) {
      alert(`Terjadi kesalahan saat evaluasi: ${err.message || 'Coba lagi.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-evaluate a specific student with AI
  const handleReevaluateAI = async (student: StudentRecord) => {
    setIsEvaluatingId(student.id);

    const listeningDataText = `Dicentang ${student.listeningData.selectedKeywords.length} kata: ${student.listeningData.selectedKeywords.join(', ')}. Status pengulangan: ${student.listeningData.repetitionCount} kali. Catatan: ${student.listeningData.customNote || '-'}`;
    const writingDataText = student.writingData.text;
    const speakingObsText = `Tag: ${student.speakingObs.tags.join(', ')}. Catatan: ${student.speakingObs.customNote || '-'}`;

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.studentName,
          listeningData: listeningDataText,
          writingData: writingDataText,
          speakingObs: speakingObsText
        })
      });

      const data = await response.json();

      if (data.success) {
        const evalResult: EvaluationResult = {
          listeningColor: data.listeningColor,
          listeningReason: data.listeningReason,
          writingColor: data.writingColor,
          writingReason: data.writingReason,
          speakingColor: data.speakingColor,
          speakingReason: data.speakingReason,
          overallColor: data.overallColor,
          overallLevel: data.overallLevel,
          recommendation: data.recommendation,
          markdown: data.markdown,
          evaluatedAt: new Date().toISOString(),
          isAiEvaluated: !data.isFallback
        };

        const updatedRecord: StudentRecord = {
          ...student,
          evaluation: evalResult,
          status: 'evaluated'
        };

        setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedRecord : s)));
        setSelectedStudentReport(updatedRecord);
      }
    } catch (err: any) {
      alert(`Gagal mengevaluasi ulang: ${err.message}`);
    } finally {
      setIsEvaluatingId(null);
    }
  };

  // Batch evaluation for pending students
  const handleBatchEvaluate = async () => {
    const pending = students.filter(s => s.status === 'pending' || !s.evaluation);
    if (pending.length === 0) {
      alert('Semua siswa telah dievaluasi.');
      return;
    }

    setIsBatchEvaluating(true);

    try {
      const payload = pending.map(s => ({
        id: s.id,
        studentName: s.studentName,
        listeningData: `Dicentang ${s.listeningData.selectedKeywords.length} kata: ${s.listeningData.selectedKeywords.join(', ')}`,
        writingData: s.writingData.text,
        speakingObs: `Tag: ${s.speakingObs.tags.join(', ')}`
      }));

      const response = await fetch('/api/evaluate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: payload })
      });

      const rawText = await response.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Server merespons bukan JSON (HTTP ${response.status}). Cek koneksi/URL: ${window.location.origin} — pesan server: ${rawText.slice(0, 120)}`
        );
      }

      if (data.success && Array.isArray(data.results)) {
        setStudents((prev) => prev.map((s) => {
          const match = data.results.find((r: any) => r.studentName === s.studentName);
          if (match) {
            return {
              ...s,
              status: 'evaluated' as const,
              evaluation: {
                listeningColor: match.listeningColor,
                listeningReason: match.listeningReason,
                writingColor: match.writingColor,
                writingReason: match.writingReason,
                speakingColor: match.speakingColor,
                speakingReason: match.speakingReason,
                overallColor: match.overallColor,
                overallLevel: match.overallLevel,
                recommendation: match.recommendation,
                markdown: match.markdown,
                evaluatedAt: new Date().toISOString(),
                isAiEvaluated: true
              }
            };
          }
          return s;
        }));
        alert(`Berhasil mengevaluasi ${pending.length} siswa secara otomatis!`);
      }
    } catch (err: any) {
      alert(`Gagal melakukan evaluasi serentak: ${err.message}`);
    } finally {
      setIsBatchEvaluating(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('Tidak ada data siswa untuk diekspor.');
      return;
    }

    const headers = [
      'ID',
      'Nama Siswa',
      'Kelas',
      'Listening Color',
      'Listening Reason',
      'Writing Color',
      'Writing Reason',
      'Speaking Color',
      'Speaking Reason',
      'Overall Color',
      'Overall Level',
      'Rekomendasi Tindak Lanjut'
    ];

    const rows = students.map(s => [
      `"${s.id}"`,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.className || '9A'}"`,
      `"${s.evaluation?.listeningColor || '-'}"`,
      `"${(s.evaluation?.listeningReason || '').replace(/"/g, '""')}"`,
      `"${s.evaluation?.writingColor || '-'}"`,
      `"${(s.evaluation?.writingReason || '').replace(/"/g, '""')}"`,
      `"${s.evaluation?.speakingColor || '-'}"`,
      `"${(s.evaluation?.speakingReason || '').replace(/"/g, '""')}"`,
      `"${s.evaluation?.overallColor || '-'}"`,
      `"${s.evaluation?.overallLevel || '-'}"`,
      `"${(s.evaluation?.recommendation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hasil_Asesmen_Diagnostik_B_Inggris_Kelas9_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Edit student
  const handleEditStudent = (student: StudentRecord) => {
    setEditingStudent(student);
    setActiveTab('form');
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (selectedStudentReport?.id === id) {
        setSelectedStudentReport(null);
      }
    }
  };

  // Save Manual
  const handleSaveManual = (record: StudentRecord) => {
    setStudents((prev) => [record, ...prev]);
    setActiveTab('list');
  };

  // Copy prompt helper for banner
  const handleCopyPromptBanner = () => {
    const fullText = `Peran dan Tugas:
Kamu adalah asisten guru bahasa Inggris yang bertugas mengevaluasi Asesmen Awal Cepat (15 menit) untuk siswa kelas 9. Analisis data tes siswa berdasarkan tiga aspek dasar dan tentukan level capaian menggunakan kategori warna (🟩 Hijau, 🟨 Kuning, 🟥 Merah) beserta rencana tindak lanjutnya.

Rubrik Penilaian:
1. Listening (Menyimak Kata Kunci):
Target kata: future, doctor, study, science, English, course, goal, help, improve.
🟩 Hijau (Mahir): Mengenali 4–5 kata kunci dengan tepat tanpa pengulangan.
🟨 Kuning (Berkembang): Mengenali 2–3 kata kunci; butuh pengulangan teks.
🟥 Merah (Perlu Bimbingan): Mengenali 0–1 kata kunci meski diulang; tampak bingung.

2. Writing (Menulis 5 Kalimat):
Target penggunaan: want to / because / plan to.
🟩 Hijau (Mahir): Kalimat lengkap (S+V+O) sesuai instruksi, struktur & ejaan tepat (>80%).
🟨 Kuning (Berkembang): Ada kesalahan struktur/ejaan, namun makna masih dapat dipahami.
🟥 Merah (Perlu Bimbingan): Sulit menyusun kalimat utuh; hanya kata lepas atau meniru contoh.

3. Speaking (Observasi Berbicara):
🟩 Hijau (Mahir): Berbicara lancar, kontak mata baik, volume jelas, berinisiatif.
🟨 Kuning (Berkembang): Ragu-ragu/terbata; perlu dorongan atau pengulangan.
🟥 Merah (Perlu Bimbingan): Enggan berbicara, menjawab dengan Bahasa Indonesia; butuh pendampingan penuh.

Penentuan Level Keseluruhan & Tindak Lanjut:
Tentukan level berdasarkan mayoritas warna:
🟩 Mayoritas Hijau: Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & peran sebagai peer-tutor.
🟨 Mayoritas Kuning: Berikan scaffolding tambahan (contoh, kosakata bergambar, latihan berulang) sebelum materi baru.
🟥 Mayoritas Merah: Rencanakan pendampingan individu/kelompok kecil & komunikasikan dengan orang tua/wali kelas.`;

    navigator.clipboard.writeText(fullText);
    setHasCopiedPrompt(true);
    setTimeout(() => setHasCopiedPrompt(false), 2000);
  };

  const evaluatedCount = students.filter(s => s.status === 'evaluated' && s.evaluation).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        evaluatedCount={evaluatedCount}
        totalCount={students.length}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'student-portal' && (
          <StudentPortal
            onSubmitStudent={handleStudentPortalSubmit}
            onSwitchToTeacherMode={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <ClassDashboard
            students={students}
            onSelectStudent={(std) => setSelectedStudentReport(std)}
            onBatchEvaluate={handleBatchEvaluate}
            isBatchEvaluating={isBatchEvaluating}
            onNavigateToForm={() => setActiveTab('form')}
          />
        )}

        {activeTab === 'form' && (
          <div className="max-w-4xl mx-auto">
            <StudentForm
              onEvaluateAI={handleEvaluateAI}
              onSaveManual={handleSaveManual}
              isLoading={isLoading}
              editingStudent={editingStudent}
              onCancelEdit={() => {
                setEditingStudent(null);
                setActiveTab('dashboard');
              }}
            />
          </div>
        )}

        {activeTab === 'list' && (
          <StudentListTable
            students={students}
            onSelectStudent={(std) => setSelectedStudentReport(std)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onReevaluateAI={handleReevaluateAI}
            onAddNewStudent={() => {
              setEditingStudent(null);
              setActiveTab('form');
            }}
            onExportCSV={handleExportCSV}
            isEvaluatingId={isEvaluatingId}
          />
        )}

        {activeTab === 'rubric' && (
          <RubricGuide
            onCopyPrompt={handleCopyPromptBanner}
            hasCopied={hasCopiedPrompt}
          />
        )}
      </main>

      {/* Report View Modal */}
      {selectedStudentReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <DiagnosticReportCard
              student={selectedStudentReport}
              onClose={() => setSelectedStudentReport(null)}
              onPrint={() => window.print()}
            />
          </div>
        </div>
      )}

      {/* System Instructions / Prompt Modal */}
      <SystemPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Aplikasi Evaluator Asesmen Awal Diagnostik Bahasa Inggris Kelas 9
          </span>
          <span className="text-slate-400">
            SMP • Kurikulum Merdeka • Pembelajaran Berdiferensiasi
          </span>
        </div>
      </footer>
    </div>
  );
}
