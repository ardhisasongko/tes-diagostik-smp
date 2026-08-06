import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Headphones, 
  PenTool, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  BookOpen,
  User,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Layers
} from 'lucide-react';
import { 
  SPEAKING_QUICK_TAGS, 
  ListeningInput, 
  WritingInput, 
  SpeakingInput 
} from '../types';
import { GRADE_MATERIALS, GradeMaterial } from '../data/gradeMaterials';

interface StudentPortalProps {
  onSubmitStudent: (
    studentName: string,
    listeningData: ListeningInput,
    writingData: WritingInput,
    speakingObs: SpeakingInput,
    className?: string
  ) => void;
  onSwitchToTeacherMode: () => void;
  teacherMode: boolean;
  onRequestUnlock: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onSubmitStudent,
  onSwitchToTeacherMode,
  teacherMode,
  onRequestUnlock
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'7' | '8' | '9'>('7');
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('7A');

  const currentMaterial = GRADE_MATERIALS[selectedGrade];
  
  // Listening state
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [repetitionCount, setRepetitionCount] = useState<'0' | '1-2' | '>2'>('0');
  
  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // Default slow-normal
  const [timesPlayed, setTimesPlayed] = useState<number>(0);
  const [showScript, setShowScript] = useState<boolean>(false);

  // Clean up audio on unmount or grade change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedGrade]);

  const handleSelectGrade = (g: '7' | '8' | '9') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSelectedGrade(g);
    setSelectedKeywords([]);
    setTimesPlayed(0);
    setClassName(`${g}A`);
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Maaf, peramban (browser) kamu tidak mendukung fitur Putar Suara (Speech Synthesis).');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel(); // Reset previous

    const utterance = new SpeechSynthesisUtterance(currentMaterial.listeningScript);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;

    // Try finding an English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.includes('en'));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setTimesPlayed(prev => {
      const newCount = prev + 1;
      if (newCount === 1) setRepetitionCount('0');
      else if (newCount <= 3) setRepetitionCount('1-2');
      else setRepetitionCount('>2');
      return newCount;
    });
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };
  
  // Writing state
  const [writingText, setWritingText] = useState('');
  
  // Speaking self reflection state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [studentNote, setStudentNote] = useState('');

  // Submitted status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleToggleKeyword = (kw: string) => {
    if (selectedKeywords.includes(kw)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
    } else {
      setSelectedKeywords([...selectedKeywords, kw]);
    }
  };

  const handleToggleTag = (tagLabel: string) => {
    if (selectedTags.includes(tagLabel)) {
      setSelectedTags(selectedTags.filter(t => t !== tagLabel));
    } else {
      setSelectedTags([...selectedTags, tagLabel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Mohon isi Nama Lengkap kamu terlebih dahulu.');
      return;
    }
    if (!writingText.trim()) {
      alert('Mohon isi bagian Menulis (Writing) setidaknya 1-2 kalimat.');
      return;
    }

    const listeningData: ListeningInput = {
      selectedKeywords,
      repetitionNeeded: repetitionCount !== '0',
      repetitionCount,
      customNote: `Asesmen Mandiri Siswa ${currentMaterial.gradeLabel} (${currentMaterial.title})`
    };

    const writingData: WritingInput = {
      text: writingText
    };

    const speakingObs: SpeakingInput = {
      tags: selectedTags,
      customNote: studentNote || `Self-reflection siswa ${currentMaterial.gradeLabel}`
    };

    onSubmitStudent(studentName, listeningData, writingData, speakingObs, className);
    setSubmittedName(studentName);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setStudentName('');
    setSelectedKeywords([]);
    setRepetitionCount('0');
    setWritingText('');
    setSelectedTags([]);
    setStudentNote('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Asesmen Berhasil Terkirim!
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Terima Kasih, {submittedName}!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              Jawaban asesmen diagnostik Bahasa Inggris kamu sudah tersimpan dengan aman. Guru Bahasa Inggris-mu akan mengevaluasi hasil ini untuk menyesuaikan metode pembelajaran kelas.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              + Isi Lagi (Untuk Siswa Lain)
            </button>
            
            {teacherMode && (
              <button
                onClick={onSwitchToTeacherMode}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition border border-slate-300 dark:border-slate-700"
              >
                Lihat Dashboard Guru
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner Siswa */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-[32px] border border-indigo-500/30 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5 bg-indigo-800/50 px-3 py-1 rounded-full border border-indigo-500/30">
            <GraduationCap className="w-4 h-4 text-amber-400" /> SMP PLUS AT-THAHIRIN
          </span>
          {teacherMode && (
            <button
              onClick={onSwitchToTeacherMode}
              className="text-xs text-indigo-300 hover:text-white font-semibold underline"
            >
              Mode Guru →
            </button>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Asesmen Awal Bahasa Inggris</span>
            <span className="bg-amber-500 text-slate-950 text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full shadow whitespace-nowrap">
              {currentMaterial.gradeLabel}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-2xl">
            Selamat datang di Lembar Asesmen Mandiri Siswa SMP PLUS AT-THAHIRIN. Silakan pilih kelasmu di bawah, lalu isi tes singkat ini (sekitar 15 menit).
          </p>
        </div>

        {/* GRADE SELECTION TABS */}
        <div className="pt-2 border-t border-indigo-800/60">
          <label className="block text-[11px] font-bold text-indigo-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Pilih Tingkat Kelas Siswa:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['7', '8', '9'] as const).map((g) => {
              const isSel = selectedGrade === g;
              const item = GRADE_MATERIALS[g];
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleSelectGrade(g)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition flex flex-col items-center justify-center gap-0.5 border ${
                    isSel
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-[1.02]'
                      : 'bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 border-indigo-700/60'
                  }`}
                >
                  <span className="text-sm">{item.gradeLabel}</span>
                  <span className={`text-[10px] font-normal truncate max-w-full ${isSel ? 'text-slate-900 font-bold' : 'text-indigo-300'}`}>
                    "{item.title}"
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Siswa */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Identitas Diri Siswa ({currentMaterial.gradeLabel})
              </h2>
              <p className="text-xs text-slate-500">Tuliskan nama lengkap dan kelas spesifikmu (misal: {selectedGrade}A, {selectedGrade}B)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Rizky"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Kelas
              </label>
              <input
                type="text"
                placeholder={`${selectedGrade}A / ${selectedGrade}B / ${selectedGrade}C`}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 1: LISTENING */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Bagian 1: Listening (Menyimak)</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  Topik: {currentMaterial.title}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {currentMaterial.listeningInstruction}
              </p>
            </div>
          </div>

          {/* AUDIO PLAYER WIDGET */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-2xl border border-indigo-500/30 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Audio Listening {currentMaterial.gradeLabel}</span>
                    {isPlayingAudio && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Memutar...
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Materi: "{currentMaterial.title}" • Bahasa Inggris Native (US)
                  </p>
                </div>
              </div>

              {/* Speech Rate Controls */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 self-start sm:self-auto">
                <Gauge className="w-3.5 h-3.5 text-indigo-400 ml-1.5 shrink-0" />
                <span className="text-[11px] text-slate-400 font-semibold">Kecepatan:</span>
                <button
                  type="button"
                  onClick={() => setSpeechRate(0.75)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                    speechRate === 0.75 ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  0.75x (Pelan)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                    speechRate === 1.0 ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  1.0x (Normal)
                </button>
              </div>
            </div>

            {/* Play & Stop Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="px-4 sm:px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 text-slate-950 shrink-0" />
                      <span>Jeda Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-slate-950 fill-current shrink-0" />
                      <span>{timesPlayed === 0 ? `Putar Audio ${currentMaterial.title}` : 'Putar Ulang Audio'}</span>
                    </>
                  )}
                </button>

                {isPlayingAudio && (
                  <button
                    type="button"
                    onClick={handleStopAudio}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
                    title="Hentikan Audio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-indigo-300 block">
                  Diputar: <span className="text-white font-black">{timesPlayed} kali</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowScript(!showScript)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-semibold"
                >
                  {showScript ? 'Sembunyikan Teks' : 'Lihat Transkrip Audio'}
                </button>
              </div>
            </div>

            {/* Optional Transkrip Teks */}
            {showScript && (
              <div className="p-3.5 bg-slate-800/90 rounded-xl border border-indigo-500/20 text-xs text-indigo-100 italic leading-relaxed">
                "{currentMaterial.listeningScript}"
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih 5 kata kunci Bahasa Inggris {currentMaterial.gradeLabel} yang ada dalam audio:
              </label>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${
                selectedKeywords.length === 5
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                  : selectedKeywords.length > 5
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200'
              }`}>
                Terpilih: {selectedKeywords.length} / 5 Kata
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentMaterial.listeningOptions.map((kw) => {
                const isChecked = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleToggleKeyword(kw)}
                    className={`px-3 py-3 rounded-2xl text-xs font-extrabold border transition flex items-center justify-between gap-1.5 min-h-[48px] min-w-0 ${
                      isChecked
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <span className="capitalize break-words leading-tight text-left">{kw}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Berapa kali kamu perlu mendengarkan audio tersebut sampai paham?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRepetitionCount('0')}
                className={`px-3 py-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center min-h-[44px] ${
                  repetitionCount === '0'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                1 Kali (Cukup Lancar)
              </button>
              <button
                type="button"
                onClick={() => setRepetitionCount('1-2')}
                className={`px-3 py-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center min-h-[44px] ${
                  repetitionCount === '1-2'
                    ? 'bg-amber-600 text-white border-amber-600 shadow'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                2-3 Kali Pengulangan
              </button>
              <button
                type="button"
                onClick={() => setRepetitionCount('>2')}
                className={`px-3 py-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center min-h-[44px] ${
                  repetitionCount === '>2'
                    ? 'bg-rose-600 text-white border-rose-600 shadow'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Lebih dari 3 Kali / Masih Bingung
              </button>
            </div>
          </div>
        </div>

        {/* BAGIAN 2: WRITING */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentMaterial.writingTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {currentMaterial.writingInstruction}
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Petunjuk Menulis {currentMaterial.gradeLabel}:
            </span>
            <p className="leading-relaxed">
              {currentMaterial.writingTips}{' '}
              <span className="inline-flex gap-1 flex-wrap">
                {currentMaterial.writingTargetPatterns.map((p) => (
                  <code key={p} className="font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                    {p}
                  </code>
                ))}
              </span>
            </p>
          </div>

          <div className="space-y-1.5">
            <textarea
              required
              rows={5}
              placeholder={currentMaterial.writingPlaceholder}
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* BAGIAN 3: REFLEKSI SPEAKING */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-2xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentMaterial.speakingTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {currentMaterial.speakingInstruction}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SPEAKING_QUICK_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.label);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleToggleTag(tag.label)}
                  className={`p-3 rounded-2xl text-xs font-bold border text-left transition flex items-center justify-between min-h-[44px] ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <span>{tag.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Catatan Tambahan untuk Guru (Opsional):
            </label>
            <input
              type="text"
              placeholder="Contoh: Saya paling suka bagian membaca, tapi masih bingung saat mendengarkan native speaker."
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm sm:text-base transition shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Kirim Jawaban Asesmen Ke Guru</span>
          </button>
        </div>
      </form>

      {!teacherMode && (
        <div className="pt-2 pb-6 text-center">
          <button
            type="button"
            onClick={onRequestUnlock}
            className="text-[11px] text-slate-400 hover:text-indigo-500 underline font-semibold opacity-70"
          >
            Guru?
          </button>
        </div>
      )}
    </div>
  );
};
