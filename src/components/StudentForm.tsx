import React, { useState } from 'react';
import { 
  User, 
  Headphones, 
  PenTool, 
  MessageSquare, 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Check,
  Plus
} from 'lucide-react';
import { 
  ListeningInput, 
  WritingInput, 
  SpeakingInput, 
  StudentRecord,
  LISTENING_TARGET_KEYWORDS,
  WRITING_TARGET_PATTERNS,
  SPEAKING_QUICK_TAGS
} from '../types';

interface StudentFormProps {
  onEvaluateAI: (
    studentName: string, 
    listeningData: ListeningInput, 
    writingData: WritingInput, 
    speakingObs: SpeakingInput,
    className?: string
  ) => Promise<void>;
  onSaveManual: (record: StudentRecord) => void;
  isLoading: boolean;
  editingStudent?: StudentRecord | null;
  onCancelEdit?: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onEvaluateAI,
  onSaveManual,
  isLoading,
  editingStudent,
  onCancelEdit
}) => {
  const [studentName, setStudentName] = useState(editingStudent?.studentName || '');
  const [className, setClassName] = useState(editingStudent?.className || '9A');

  // Listening state
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    editingStudent?.listeningData?.selectedKeywords || []
  );
  const [repetitionNeeded, setRepetitionNeeded] = useState<boolean>(
    editingStudent?.listeningData?.repetitionNeeded || false
  );
  const [repetitionCount, setRepetitionCount] = useState<'0' | '1-2' | '>2'>(
    editingStudent?.listeningData?.repetitionCount || '0'
  );
  const [listeningNote, setListeningNote] = useState<string>(
    editingStudent?.listeningData?.customNote || ''
  );

  // Writing state
  const [writingText, setWritingText] = useState<string>(
    editingStudent?.writingData?.text || ''
  );
  const [writingNote, setWritingNote] = useState<string>(
    editingStudent?.writingData?.notes || ''
  );

  // Speaking state
  const [speakingTags, setSpeakingTags] = useState<string[]>(
    editingStudent?.speakingObs?.tags || []
  );
  const [speakingNote, setSpeakingNote] = useState<string>(
    editingStudent?.speakingObs?.customNote || ''
  );

  // Toggle keyword selection
  const toggleKeyword = (word: string) => {
    if (selectedKeywords.includes(word)) {
      setSelectedKeywords(selectedKeywords.filter(w => w !== word));
    } else {
      setSelectedKeywords([...selectedKeywords, word]);
    }
  };

  // Select all keywords helper
  const selectAllKeywords = () => {
    setSelectedKeywords([...LISTENING_TARGET_KEYWORDS]);
  };

  // Clear keywords helper
  const clearKeywords = () => {
    setSelectedKeywords([]);
  };

  // Toggle speaking tag selection
  const toggleSpeakingTag = (tagLabel: string) => {
    if (speakingTags.includes(tagLabel)) {
      setSpeakingTags(speakingTags.filter(t => t !== tagLabel));
    } else {
      setSpeakingTags([...speakingTags, tagLabel]);
    }
  };

  // Check which target writing patterns are detected
  const detectedPatterns = WRITING_TARGET_PATTERNS.filter(pattern => 
    writingText.toLowerCase().includes(pattern)
  );

  // Form submit handler
  const handleSubmitAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Mohon isi nama siswa terlebih dahulu.');
      return;
    }

    const listeningData: ListeningInput = {
      selectedKeywords,
      repetitionNeeded,
      repetitionCount,
      customNote: listeningNote
    };

    const writingData: WritingInput = {
      text: writingText,
      notes: writingNote
    };

    const speakingObs: SpeakingInput = {
      tags: speakingTags,
      customNote: speakingNote
    };

    await onEvaluateAI(studentName.trim(), listeningData, writingData, speakingObs, className);
  };

  // Reset form
  const handleReset = () => {
    setStudentName('');
    setSelectedKeywords([]);
    setRepetitionNeeded(false);
    setRepetitionCount('0');
    setListeningNote('');
    setWritingText('');
    setWritingNote('');
    setSpeakingTags([]);
    setSpeakingNote('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmitAI} className="space-y-6">
      {/* Title & Student Meta */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {editingStudent ? 'Edit Data Asesmen Siswa' : 'Input Asesmen Diagnostik Siswa Baru'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Isi lembar observasi singkat (15 menit) untuk dievaluasi oleh Gemini AI
              </p>
            </div>
          </div>

          {editingStudent && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Batal Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Kelas / Rombel
            </label>
            <input
              type="text"
              placeholder="Contoh: 9A"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 1. LISTENING SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                1. Aspek Listening (Menyimak Kata Kunci)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pilih kata kunci yang berhasil dicatat/dikenali siswa dari teks audio
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${
              selectedKeywords.length >= 4 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                : selectedKeywords.length >= 2
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {selectedKeywords.length} / 9 Kata Kunci
            </span>
          </div>
        </div>

        {/* Target Word Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Keywords (Klik untuk centang):
            </span>
            <div className="space-x-2 text-xs">
              <button
                type="button"
                onClick={selectAllKeywords}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Pilih Semua
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={clearKeywords}
                className="text-slate-500 hover:underline"
              >
                Bersihkan
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {LISTENING_TARGET_KEYWORDS.map((word) => {
              const isSelected = selectedKeywords.includes(word);
              return (
                <button
                  type="button"
                  key={word}
                  onClick={() => toggleKeyword(word)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium font-mono transition flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Repetition Selector */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Status Pemutaran Audio / Pengulangan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setRepetitionCount('0'); setRepetitionNeeded(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center text-center min-h-[44px] ${
                  repetitionCount === '0'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Tanpa Pengulangan (🟩)
              </button>
              <button
                type="button"
                onClick={() => { setRepetitionCount('1-2'); setRepetitionNeeded(true); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center text-center min-h-[44px] ${
                  repetitionCount === '1-2'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                1-2 Kali Pengulangan (🟨)
              </button>
              <button
                type="button"
                onClick={() => { setRepetitionCount('>2'); setRepetitionNeeded(true); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center text-center min-h-[44px] ${
                  repetitionCount === '>2'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                &gt;2 Kali / Bingung (🟥)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Catatan Khusus Listening (Opsional):
            </label>
            <input
              type="text"
              placeholder="Misal: Tampak fokus, mencatat dengan cepat"
              value={listeningNote}
              onChange={(e) => setListeningNote(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. WRITING SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                2. Aspek Writing (Menulis 5 Kalimat)
              </h3>
              <p className="text-xs text-slate-500">
                Tempelkan atau ketik teks tulisan siswa. Target frasa: <code className="font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded">want to</code>, <code className="font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded">because</code>, <code className="font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded">plan to</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {WRITING_TARGET_PATTERNS.map((pattern) => {
              const isFound = detectedPatterns.includes(pattern);
              return (
                <span
                  key={pattern}
                  className={`text-xs font-mono px-2.5 py-0.5 rounded-md border ${
                    isFound
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                      : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'
                  }`}
                >
                  {isFound ? '✓ ' : ''}{pattern}
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Tempelkan tulisan 5 kalimat siswa di sini... Contoh: I want to study English because I plan to be a doctor in the future. Science is my favorite subject."
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Karakter: {writingText.length} | Kata: {writingText.trim() ? writingText.trim().split(/\s+/).length : 0}
            </span>
            {writingText && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Pola Terdeteksi: {detectedPatterns.length} / 3 Target Frasa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. SPEAKING SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              3. Aspek Speaking (Observasi Berbicara Berpasangan)
            </h3>
            <p className="text-xs text-slate-500">
              Pilih tag observasi guru saat siswa berpasangan atau ketik catatan khusus
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tag Observasi Cepat Guru:
          </label>

          <div className="flex flex-wrap gap-2">
            {SPEAKING_QUICK_TAGS.map((tag) => {
              const isSelected = speakingTags.includes(tag.label);
              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleSpeakingTag(tag.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : `${tag.color} border-transparent opacity-80 hover:opacity-100`
                  }`}
                >
                  <span>{tag.tier}</span>
                  <span>{tag.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Catatan Observasi Berbicara Detail:
            </label>
            <input
              type="text"
              placeholder="Contoh: Berbicara lancar, kontak mata baik dengan teman sekelompok, volume suara jelas, berinisiatif bertanya."
              value={speakingNote}
              onChange={(e) => setSpeakingNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Reset Form
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Menganalisis dengan Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Evaluasi & Analisis dengan Gemini AI</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
