import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SYSTEM_INSTRUCTIONS_FULL = `Peran dan Tugas:
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

const USER_INPUT_FORMAT = `Nama Siswa: [Masukkan nama siswa]
Data Listening: [Masukkan jumlah dan kata kunci yang dicentang siswa]
Data Writing: [Tempelkan teks tulisan siswa di sini]
Observasi Speaking: [Masukkan catatan observasi guru saat siswa berpasangan]`;

const EXPECTED_OUTPUT_FORMAT = `Format Balasan yang Diharapkan (Gunakan Markdown):
Hasil Analisis Diagnostik: [Nama Siswa]
🎧 Listening: [Emoji Warna] - [Alasan singkat berdasarkan rubrik]
✍️ Writing: [Emoji Warna] - [Alasan singkat berdasarkan tata bahasa dan struktur]
🗣️ Speaking: [Emoji Warna] - [Alasan singkat berdasarkan catatan observasi]
Level Keseluruhan: [Emoji Warna Mayoritas] - [Mahir / Berkembang / Perlu Bimbingan]
Rekomendasi Tindak Lanjut: [Berikan tindakan spesifik berdasarkan level keseluruhan sesuai rubrik]`;

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyAll = () => {
    const fullPrompt = `1. System Instructions (Instruksi Sistem)\n${SYSTEM_INSTRUCTIONS_FULL}\n\n2. User Input Format (Prompt Pengguna)\n${USER_INPUT_FORMAT}\n\n3. Expected Output (Format Keluaran)\n${EXPECTED_OUTPUT_FORMAT}`;
    navigator.clipboard.writeText(fullPrompt);
    setCopiedSection('ALL');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Instruksi Sistem & Prompt Google AI Studio
              </h3>
              <p className="text-xs text-slate-400">
                Salin teks ini ke kotak "System Instructions" di Google AI Studio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 dark:text-slate-200">
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                1. System Instructions (Instruksi Sistem)
              </span>
              <button
                onClick={() => copyText(SYSTEM_INSTRUCTIONS_FULL, 'SYS')}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 transition flex items-center space-x-1"
              >
                {copiedSection === 'SYS' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'SYS' ? 'Tersalin' : 'Salin Instruksi'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {SYSTEM_INSTRUCTIONS_FULL}
            </pre>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                2. User Input Format (Prompt Pengguna)
              </span>
              <button
                onClick={() => copyText(USER_INPUT_FORMAT, 'USER')}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 transition flex items-center space-x-1"
              >
                {copiedSection === 'USER' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'USER' ? 'Tersalin' : 'Salin Format Input'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {USER_INPUT_FORMAT}
            </pre>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                3. Expected Output (Format Keluaran)
              </span>
              <button
                onClick={() => copyText(EXPECTED_OUTPUT_FORMAT, 'OUT')}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 transition flex items-center space-x-1"
              >
                {copiedSection === 'OUT' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'OUT' ? 'Tersalin' : 'Salin Format Output'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {EXPECTED_OUTPUT_FORMAT}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 transition"
          >
            Tutup
          </button>

          <button
            onClick={copyAll}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow flex items-center space-x-2"
          >
            {copiedSection === 'ALL' ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copiedSection === 'ALL' ? 'Semua Prompt Tersalin!' : 'Salin Seluruh Prompt LENGKAP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
