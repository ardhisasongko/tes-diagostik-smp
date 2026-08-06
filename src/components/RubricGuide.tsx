import React, { useState } from 'react';
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  MessageSquare, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

interface RubricGuideProps {
  onCopyPrompt: () => void;
  hasCopied: boolean;
}

export const RubricGuide: React.FC<RubricGuideProps> = ({ onCopyPrompt, hasCopied }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Panduan Resmi Guru
            </span>
            <span className="text-xs text-slate-400">• Asesmen Awal Cepat 15 Menit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Rubrik Penilaian Tes Diagnostik Bahasa Inggris Kelas 9
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl">
            Sistem evaluasi berbasis 3 aspek utama (Listening, Writing, dan Speaking). Hasil dikategorikan menggunakan warna (🟩 Hijau, 🟨 Kuning, 🟥 Merah) untuk memetakan Pembelajaran Berdiferensiasi.
          </p>
        </div>

        <button
          onClick={onCopyPrompt}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
        >
          {hasCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
          <span>{hasCopied ? 'Tersalin ke Clipboard!' : 'Salin Teks System Instructions'}</span>
        </button>
      </div>

      {/* Target Word Lists Banner */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Materi Asesmen Listening & Writing Per Kelas (SMP PLUS AT-THAHIRIN):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kelas 7 */}
          <div className="bg-indigo-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-indigo-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-700 pb-2">
              <span className="bg-indigo-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                Kelas 7
              </span>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                Topik: My Family
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                🎧 5 Kata Kunci Listening:
              </p>
              <div className="flex flex-wrap gap-1">
                {['family', 'teacher', 'nurse', 'brother', 'house'].map((w) => (
                  <span key={w} className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                ✍️ Pola Kalimat Writing:
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Perkenalan anggota keluarga sederhana (S+V+O)
              </p>
            </div>
          </div>

          {/* Kelas 8 */}
          <div className="bg-emerald-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-emerald-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-slate-700 pb-2">
              <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                Kelas 8
              </span>
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Topik: My Weekend
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                🎧 5 Kata Kunci Listening:
              </p>
              <div className="flex flex-wrap gap-1">
                {['weekend', 'beach', 'swam', 'volleyball', 'restaurant'].map((w) => (
                  <span key={w} className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                ✍️ Pola Kalimat Writing:
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Recount liburan / pengalaman (Simple Past)
              </p>
            </div>
          </div>

          {/* Kelas 9 */}
          <div className="bg-amber-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-700 pb-2">
              <span className="bg-amber-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                Kelas 9
              </span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Topik: Future Plans
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                🎧 Kata Kunci Listening:
              </p>
              <div className="flex flex-wrap gap-1">
                {['future', 'doctor', 'study', 'science', 'goal'].map((w) => (
                  <span key={w} className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                ✍️ Pola Kalimat Writing:
              </p>
              <div className="flex flex-wrap gap-1">
                {['want to', 'because', 'plan to'].map((p) => (
                  <span key={p} className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Aspects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aspect 1: Listening */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Listening</h3>
              <p className="text-xs text-slate-500">Menyimak Kata Kunci</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                <span>🟩 Hijau (Mahir)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Mengenali <strong>4–5 kata kunci</strong> dengan tepat tanpa pengulangan (atau pemutaran tunggal).
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                <span>🟨 Kuning (Berkembang)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Mengenali <strong>2–3 kata kunci</strong>; butuh pengulangan teks audio.
              </p>
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 dark:text-rose-300 mb-1">
                <span>🟥 Merah (Perlu Bimbingan)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Mengenali <strong>0–1 kata kunci</strong> meski telah diulang; tampak bingung.
              </p>
            </div>
          </div>
        </div>

        {/* Aspect 2: Writing */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Writing</h3>
              <p className="text-xs text-slate-500">Menulis 5 Kalimat</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                <span>🟩 Hijau (Mahir)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Kalimat lengkap (S+V+O) sesuai instruksi, struktur & ejaan tepat (<strong>&gt;80%</strong>).
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                <span>🟨 Kuning (Berkembang)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Ada kesalahan struktur/ejaan, namun makna umum kalimat masih dapat dipahami.
              </p>
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 dark:text-rose-300 mb-1">
                <span>🟥 Merah (Perlu Bimbingan)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Sulit menyusun kalimat utuh; hanya menulis kata lepas atau meniru contoh.
              </p>
            </div>
          </div>
        </div>

        {/* Aspect 3: Speaking */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">3. Speaking</h3>
              <p className="text-xs text-slate-500">Observasi Berbicara Berpasangan</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                <span>🟩 Hijau (Mahir)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Berbicara lancar, kontak mata baik, volume jelas, dan berinisiatif aktif.
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                <span>🟨 Kuning (Berkembang)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Ragu-ragu/terbata-bata; memerlukan dorongan atau pengulangan pertanyaan.
              </p>
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/50">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 dark:text-rose-300 mb-1">
                <span>🟥 Merah (Perlu Bimbingan)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Enggan berbicara Bahasa Inggris, menjawab dalam Bahasa Indonesia; butuh pendampingan penuh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Rules & Action Plan Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Penentuan Level Keseluruhan & Rencana Tindak Lanjut</span>
        </h3>
        <p className="text-xs text-slate-500">
          Tentukan level berdasarkan mayoritas warna dari ketiga aspek di atas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                🟩 Mayoritas Hijau
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                MAHIR
              </span>
            </div>
            <p className="text-xs text-emerald-950 dark:text-emerald-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & fungsikan sebagai <em>peer-tutor</em> (tutor sebaya).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-900 dark:text-amber-200">
                🟨 Mayoritas Kuning
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                BERKEMBANG
              </span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Berikan <em>scaffolding</em> tambahan (contoh nyata, kosakata bergambar, latihan berulang) sebelum memulai materi baru.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/70 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-rose-900 dark:text-rose-200">
                🟥 Mayoritas Merah
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                PERLU BIMBINGAN
              </span>
            </div>
            <p className="text-xs text-rose-950 dark:text-rose-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Rencanakan pendampingan individu / kelompok kecil intensif & komunikasikan perkembangan dengan orang tua/wali kelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
