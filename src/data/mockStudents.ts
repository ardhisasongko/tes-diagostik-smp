import { StudentRecord } from '../types';

export const INITIAL_MOCK_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    studentName: 'Ahmad Budi Santoso',
    className: '9A',
    listeningData: {
      selectedKeywords: ['future', 'doctor', 'science', 'English', 'goal'],
      repetitionNeeded: false,
      repetitionCount: '0',
      customNote: 'Siswa langsung merespons dan mencatat 5 kata kunci tanpa jeda.'
    },
    writingData: {
      text: 'I want to study English because I plan to be a doctor in the future. Science is my favorite subject in school. I want to improve my speaking skill.',
      notes: 'Gaya penulisan rapi, 3 kata kunci utama (want to, because, plan to) terpakai tepat.'
    },
    speakingObs: {
      tags: ['Berbicara Lancar', 'Kontak Mata Baik', 'Volume Jelas', 'Berinisiatif'],
      customNote: 'Antusias berdialog dengan teman sejawat, menjawab pertanyaan guru tanpa ragu.'
    },
    status: 'evaluated',
    createdAt: '2026-08-05T10:00:00Z',
    evaluation: {
      listeningColor: '🟩',
      listeningReason: 'Mengenali 5 kata kunci (future, doctor, science, English, goal) dengan tepat tanpa pengulangan.',
      writingColor: '🟩',
      writingReason: 'Kalimat lengkap (S+V+O) sesuai instruksi, struktur & ejaan tepat (>80%) menggunakan want to, because, plan to.',
      speakingColor: '🟩',
      speakingReason: 'Berbicara lancar, kontak mata baik, volume jelas, dan berinisiatif dalam percakapan.',
      overallColor: '🟩',
      overallLevel: 'Mahir',
      recommendation: 'Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & fungsikan sebagai peer-tutor untuk teman sekelas.',
      markdown: `Hasil Analisis Diagnostik: Ahmad Budi Santoso
🎧 Listening: 🟩 - Mengenali 5 kata kunci (future, doctor, science, English, goal) dengan tepat tanpa pengulangan.
✍️ Writing: 🟩 - Kalimat lengkap (S+V+O) sesuai instruksi, struktur & ejaan tepat (>80%).
🗣️ Speaking: 🟩 - Berbicara lancar, kontak mata baik, volume jelas, berinisiatif.
Level Keseluruhan: 🟩 - Mahir
Rekomendasi Tindak Lanjut: Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & peran sebagai peer-tutor.`,
      evaluatedAt: '2026-08-05T10:05:00Z',
      isAiEvaluated: true
    }
  },
  {
    id: 'std-2',
    studentName: 'Siti Rahmawati',
    className: '9A',
    listeningData: {
      selectedKeywords: ['future', 'study', 'help'],
      repetitionNeeded: true,
      repetitionCount: '1-2',
      customNote: 'Minta pemutaran teks 1 kali lagi untuk memastikan kata kunci.'
    },
    writingData: {
      text: 'I want to study English. Because English is important. I plan to help my friends.',
      notes: 'Struktur dasar ada, kalimat pendek-pendek.'
    },
    speakingObs: {
      tags: ['Ragu-ragu/Terbata', 'Butuh Pengulangan/Dorongan'],
      customNote: 'Masih sedikit cemas saat diminta berbicara depan kelas, namun mau mencoba.'
    },
    status: 'evaluated',
    createdAt: '2026-08-05T10:10:00Z',
    evaluation: {
      listeningColor: '🟨',
      listeningReason: 'Mengenali 3 kata kunci (future, study, help) setelah pemutaran teks diulang.',
      writingColor: '🟨',
      writingReason: 'Ada sedikit kesalahan variasi struktur, namun makna kalimat masih dapat dipahami.',
      speakingColor: '🟨',
      speakingReason: 'Siswa tampak ragu-ragu dan terbata-bata; memerlukan dorongan dan pengulangan dari guru.',
      overallColor: '🟨',
      overallLevel: 'Berkembang',
      recommendation: 'Berikan scaffolding tambahan (contoh kalimat, kosakata bergambar, latihan berulang) sebelum masuk materi baru.',
      markdown: `Hasil Analisis Diagnostik: Siti Rahmawati
🎧 Listening: 🟨 - Mengenali 3 kata kunci; butuh pengulangan teks.
✍️ Writing: 🟨 - Ada kesalahan struktur/ejaan, namun makna masih dapat dipahami.
🗣️ Speaking: 🟨 - Ragu-ragu/terbata; perlu dorongan atau pengulangan.
Level Keseluruhan: 🟨 - Berkembang
Rekomendasi Tindak Lanjut: Berikan scaffolding tambahan (contoh, kosakata bergambar, latihan berulang) sebelum materi baru.`,
      evaluatedAt: '2026-08-05T10:12:00Z',
      isAiEvaluated: true
    }
  },
  {
    id: 'std-3',
    studentName: 'Rizky Pratama',
    className: '9A',
    listeningData: {
      selectedKeywords: ['doctor'],
      repetitionNeeded: true,
      repetitionCount: '>2',
      customNote: 'Tampak kebingungan mengikuti audio listening.'
    },
    writingData: {
      text: 'Doctor study english because good.',
      notes: 'Hanya gabungan kata lepas tanpa struktur S+V+O utuh.'
    },
    speakingObs: {
      tags: ['Enggan Berbicara', 'Menjawab dng Bahasa Indonesia', 'Butuh Pendampingan Penuh'],
      customNote: 'Menjawab "Saya tidak bisa bahasa Inggris pak" saat diajak berdialog.'
    },
    status: 'evaluated',
    createdAt: '2026-08-05T10:15:00Z',
    evaluation: {
      listeningColor: '🟥',
      listeningReason: 'Hanya mengenali 1 kata kunci meskipun audio diputar beberapa kali; tampak bingung.',
      writingColor: '🟥',
      writingReason: 'Sulit menyusun kalimat utuh; hanya menulis frasa kata lepas tanpa pola S+V+O.',
      speakingColor: '🟥',
      speakingReason: 'Enggan berbicara Bahasa Inggris dan menjawab penuh dalam Bahasa Indonesia.',
      overallColor: '🟥',
      overallLevel: 'Perlu Bimbingan',
      recommendation: 'Rencanakan pendampingan individu/kelompok kecil khusus & komunikasikan dengan orang tua/wali kelas.',
      markdown: `Hasil Analisis Diagnostik: Rizky Pratama
🎧 Listening: 🟥 - Mengenali 0–1 kata kunci meski diulang; tampak bingung.
✍️ Writing: 🟥 - Sulit menyusun kalimat utuh; hanya kata lepas atau meniru contoh.
🗣️ Speaking: 🟥 - Enggan berbicara, menjawab dengan Bahasa Indonesia; butuh pendampingan penuh.
Level Keseluruhan: 🟥 - Perlu Bimbingan
Rekomendasi Tindak Lanjut: Rencanakan pendampingan individu/kelompok kecil & komunikasikan dengan orang tua/wali kelas.`,
      evaluatedAt: '2026-08-05T10:18:00Z',
      isAiEvaluated: true
    }
  },
  {
    id: 'std-4',
    studentName: 'Dewi Lestari',
    className: '9A',
    listeningData: {
      selectedKeywords: ['future', 'course', 'goal', 'improve'],
      repetitionNeeded: false,
      repetitionCount: '0',
      customNote: 'Mencatat 4 kata kunci utama dengan mudah.'
    },
    writingData: {
      text: 'My goal is to improve my English course. I plan to study every day because I want to get the best score.',
      notes: 'Penulisan tata bahasa runtut dan tepat.'
    },
    speakingObs: {
      tags: ['Berbicara Lancar', 'Kontak Mata Baik', 'Volume Jelas'],
      customNote: 'Pengucapan (pronunciation) sangat jelas dan intonasi tepat.'
    },
    status: 'evaluated',
    createdAt: '2026-08-05T10:20:00Z',
    evaluation: {
      listeningColor: '🟩',
      listeningReason: 'Mengenali 4 kata kunci dengan tepat tanpa pengulangan.',
      writingColor: '🟩',
      writingReason: 'Kalimat lengkap (S+V+O) dengan struktur dan ejaan tepat (>80%).',
      speakingColor: '🟩',
      speakingReason: 'Berbicara lancar, kontak mata baik, dan volume suara jelas.',
      overallColor: '🟩',
      overallLevel: 'Mahir',
      recommendation: 'Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & peran sebagai peer-tutor.',
      markdown: `Hasil Analisis Diagnostik: Dewi Lestari
🎧 Listening: 🟩 - Mengenali 4 kata kunci dengan tepat tanpa pengulangan.
✍️ Writing: 🟩 - Kalimat lengkap (S+V+O) sesuai instruksi, struktur & ejaan tepat (>80%).
🗣️ Speaking: 🟩 - Berbicara lancar, kontak mata baik, volume jelas.
Level Keseluruhan: 🟩 - Mahir
Rekomendasi Tindak Lanjut: Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & peran sebagai peer-tutor.`,
      evaluatedAt: '2026-08-05T10:22:00Z',
      isAiEvaluated: true
    }
  },
  {
    id: 'std-5',
    studentName: 'Doni Setiawan',
    className: '9A',
    listeningData: {
      selectedKeywords: ['English', 'study'],
      repetitionNeeded: true,
      repetitionCount: '1-2',
      customNote: 'Mencatat 2 kata kunci.'
    },
    writingData: {
      text: 'I want to study English science. I plan to doctor.',
      notes: 'Ada frasa yang terpotong di akhir.'
    },
    speakingObs: {
      tags: ['Ragu-ragu/Terbata', 'Butuh Pengulangan/Dorongan'],
      customNote: 'Perlu beberapa detik jeda sebelum menjawab.'
    },
    status: 'evaluated',
    createdAt: '2026-08-05T10:25:00Z',
    evaluation: {
      listeningColor: '🟨',
      listeningReason: 'Mengenali 2 kata kunci; butuh pengulangan audio.',
      writingColor: '🟨',
      writingReason: 'Ada kesalahan struktur dan frasa, namun maksud utama dapat dipahami.',
      speakingColor: '🟨',
      speakingReason: 'Siswa ragu-ragu dan butuh dorongan pengulangan dari guru.',
      overallColor: '🟨',
      overallLevel: 'Berkembang',
      recommendation: 'Berikan scaffolding tambahan (contoh, kosakata bergambar, latihan berulang) sebelum materi baru.',
      markdown: `Hasil Analisis Diagnostik: Doni Setiawan
🎧 Listening: 🟨 - Mengenali 2 kata kunci; butuh pengulangan teks.
✍️ Writing: 🟨 - Ada kesalahan struktur/ejaan, namun makna masih dapat dipahami.
🗣️ Speaking: 🟨 - Ragu-ragu/terbata; perlu dorongan atau pengulangan.
Level Keseluruhan: 🟨 - Berkembang
Rekomendasi Tindak Lanjut: Berikan scaffolding tambahan (contoh, kosakata bergambar, latihan berulang) sebelum materi baru.`,
      evaluatedAt: '2026-08-05T10:27:00Z',
      isAiEvaluated: true
    }
  }
];
