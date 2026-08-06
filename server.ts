import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTIONS = `Kamu adalah asisten guru bahasa Inggris SMP PLUS AT-THAHIRIN yang bertugas mengevaluasi Asesmen Awal Cepat (15 menit) untuk siswa Kelas 7, Kelas 8, atau Kelas 9. Analisis data tes siswa berdasarkan tiga aspek (Listening, Writing, dan Speaking) dan tentukan level capaian menggunakan kategori warna (🟩 Hijau, 🟨 Kuning, 🟥 Merah) beserta rencana tindak lanjutnya.

Rubrik Penilaian Berdasarkan Kelas & Topik:

1. Listening (Menyimak Kata Kunci Target):
- Kelas 7 (Topik: My Family): Target kata: family, teacher, nurse, brother, house.
- Kelas 8 (Topik: My Weekend): Target kata: weekend, beach, swam, volleyball, restaurant.
- Kelas 9 (Topik: Future Plans): Target kata: vocational school, digital technology, comic books, camera, exchange program (atau future, doctor, study, science, English, course, goal, help, improve).
- 🟩 Hijau (Mahir): Mengenali 4–5 kata kunci target dengan tepat tanpa/minimal pengulangan.
- 🟨 Kuning (Berkembang): Mengenali 2–3 kata kunci target; memerlukan pengulangan audio.
- 🟥 Merah (Perlu Bimbingan): Mengenali 0–1 kata kunci meski diulang; tampak bingung.

2. Writing (Menulis 5 Kalimat):
- Kelas 7: Penggunaan kalimat sederhana S+V+O/C (pola: my name is, is a, have, live in, love).
- Kelas 8: Penggunaan Simple Past / Recount sederhana (pola: last weekend, went to, played, ate, was).
- Kelas 9: Penggunaan Future Plans / Intention (pola: want to, because, plan to).
- 🟩 Hijau (Mahir): Kalimat lengkap & relevan dengan topik, struktur & ejaan tepat (>80%).
- 🟨 Kuning (Berkembang): Ada beberapa kesalahan struktur/ejaan, namun makna umum dapat dipahami.
- 🟥 Merah (Perlu Bimbingan): Sulit menyusun kalimat utuh; hanya kata lepas atau meniru contoh.

3. Speaking (Observasi / Refleksi Berbicara):
- 🟩 Hijau (Mahir): Berbicara lancar, kontak mata baik, volume jelas, berinisiatif/paham gagasan utama.
- 🟨 Kuning (Berkembang): Ragu-ragu/terbata-bata; memerlukan dorongan atau pengulangan.
- 🟥 Merah (Perlu Bimbingan): Enggan berbicara, menjawab dengan Bahasa Indonesia; butuh pendampingan penuh.

Penentuan Level Keseluruhan & Tindak Lanjut:
Tentukan level berdasarkan mayoritas warna dari ketiga aspek (Listening, Writing, Speaking):
🟩 Mayoritas Hijau: Level Keseluruhan: Mahir. Tindak Lanjut: Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & fungsikan sebagai peer-tutor.
🟨 Mayoritas Kuning: Level Keseluruhan: Berkembang. Tindak Lanjut: Berikan scaffolding tambahan (contoh, kosakata bergambar, latihan berulang) sebelum materi baru.
🟥 Mayoritas Merah: Level Keseluruhan: Perlu Bimbingan. Tindak Lanjut: Rencanakan pendampingan individu/kelompok kecil & komunikasikan dengan orang tua/wali kelas.

Format Output Harus Selalu Mengikuti Format Berikut:
Hasil Analisis Diagnostik: [Nama Siswa]
🎧 Listening: [Emoji Warna] - [Alasan singkat berdasarkan rubrik]
✍️ Writing: [Emoji Warna] - [Alasan singkat berdasarkan tata bahasa dan struktur]
🗣️ Speaking: [Emoji Warna] - [Alasan singkat berdasarkan catatan observasi]
Level Keseluruhan: [Emoji Warna Mayoritas] - [Mahir / Berkembang / Perlu Bimbingan]
Rekomendasi Tindak Lanjut: [Berikan tindakan spesifik berdasarkan level keseluruhan sesuai rubrik]`;

// Helper to evaluate via rules if offline/fallback needed
function ruleBasedEvaluation(studentName: string, listeningData: string, writingData: string, speakingObs: string) {
  const listeningLower = listeningData.toLowerCase();
  
  // Combine all grade target keywords for fallback match
  const allKeywords = [
    // Grade 7
    'family', 'teacher', 'nurse', 'brother', 'house',
    // Grade 8
    'weekend', 'beach', 'swam', 'volleyball', 'restaurant',
    // Grade 9
    'vocational school', 'digital technology', 'comic books', 'camera', 'exchange program',
    'future', 'doctor', 'study', 'science', 'english', 'course', 'goal', 'help', 'improve'
  ];

  let foundCount = 0;
  allKeywords.forEach(kw => {
    if (listeningLower.includes(kw.toLowerCase())) foundCount++;
  });

  // Check count explicitly provided in text e.g. "4 kata" or "5 kata" or "dicentang 4"
  const matchNum = listeningData.match(/(\d+)\s*(kata|keywords?)/i) || listeningData.match(/dicentang\s*(\d+)/i);
  if (matchNum) {
    foundCount = Math.max(foundCount, parseInt(matchNum[1], 10));
  }

  let listeningColor = '🟨';
  let listeningReason = `Mengenali ${foundCount} kata kunci. Memerlukan sedikit pengulangan.`;
  if (foundCount >= 4 && !listeningLower.includes('diulang') && !listeningLower.includes('bingung')) {
    listeningColor = '🟩';
    listeningReason = `Mengenali ${foundCount} kata kunci target dengan tepat tanpa/minimal pengulangan.`;
  } else if (foundCount <= 1 || listeningLower.includes('bingung')) {
    listeningColor = '🟥';
    listeningReason = `Hanya mengenali ${foundCount} kata kunci meskipun telah diulang; tampak bingung.`;
  }

  // Writing calculation
  const writingLower = writingData.toLowerCase();
  const targetPatterns = [
    'my name is', 'is a', 'have', 'live in', 'love',
    'last weekend', 'went to', 'played', 'ate', 'was',
    'want to', 'because', 'plan to'
  ];
  let patternCount = 0;
  targetPatterns.forEach(p => {
    if (writingLower.includes(p)) patternCount++;
  });

  let writingColor = '🟨';
  let writingReason = 'Ada beberapa kesalahan struktur/ejaan, namun makna umum dapat dipahami.';
  
  if ((patternCount >= 2 || writingData.length > 40) && !writingLower.includes('sulit')) {
    writingColor = '🟩';
    writingReason = `Kalimat lengkap S+V+O sesuai instruksi dengan penggunaan kata/pola tata bahasa yang tepat.`;
  } else if (writingData.length < 15 || writingLower.includes('sulit')) {
    writingColor = '🟥';
    writingReason = 'Sulit menyusun kalimat utuh; hanya menggunakan kata lepas atau meniru contoh.';
  }

  // Speaking calculation
  const speakingLower = speakingObs.toLowerCase();
  let speakingColor = '🟨';
  let speakingReason = 'Siswa tampak ragu-ragu/terbata; memerlukan dorongan atau pengulangan.';

  if (speakingLower.includes('lancar') || speakingLower.includes('kontak mata baik') || speakingLower.includes('inisiatif') || speakingLower.includes('jelas')) {
    speakingColor = '🟩';
    speakingReason = 'Berbicara lancar, kontak mata baik, volume suara jelas, dan berinisiatif.';
  } else if (speakingLower.includes('enggan') || speakingLower.includes('bahasa indonesia') || speakingLower.includes('pendampingan penuh') || speakingLower.includes('diam')) {
    speakingColor = '🟥';
    speakingReason = 'Enggan berbicara dalam Bahasa Inggris, menjawab dengan Bahasa Indonesia, butuh pendampingan penuh.';
  }

  // Overall Color calculation (majority)
  const colors = [listeningColor, writingColor, speakingColor];
  const greenCount = colors.filter(c => c === '🟩').length;
  const yellowCount = colors.filter(c => c === '🟨').length;
  const redCount = colors.filter(c => c === '🟥').length;

  let overallColor = '🟨';
  let overallLevel = 'Berkembang';
  let recommendation = 'Berikan scaffolding tambahan (contoh, kosakata bergambar, latihan berulang) sebelum masuk ke materi baru.';

  if (greenCount >= 2) {
    overallColor = '🟩';
    overallLevel = 'Mahir';
    recommendation = 'Lanjutkan ke materi berikutnya; berikan tugas pengayaan (enrichment) & perankan siswa sebagai peer-tutor.';
  } else if (redCount >= 2) {
    overallColor = '🟥';
    overallLevel = 'Perlu Bimbingan';
    recommendation = 'Rencanakan pendampingan individu/kelompok kecil & komunikasikan perkembangan dengan orang tua/wali kelas.';
  }

  const markdown = `Hasil Analisis Diagnostik: ${studentName}
🎧 Listening: ${listeningColor} - ${listeningReason}
✍️ Writing: ${writingColor} - ${writingReason}
🗣️ Speaking: ${speakingColor} - ${speakingReason}
Level Keseluruhan: ${overallColor} - ${overallLevel}
Rekomendasi Tindak Lanjut: ${recommendation}`;

  return {
    studentName,
    listeningColor,
    listeningReason,
    writingColor,
    writingReason,
    speakingColor,
    speakingReason,
    overallColor,
    overallLevel,
    recommendation,
    markdown
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Evaluator Asesmen Diagnostik B. Inggris Kelas 9 API Ready" });
  });

  // Evaluate single student endpoint
  app.post("/api/evaluate", async (req, res) => {
    const { studentName, listeningData, writingData, speakingObs } = req.body;

    if (!studentName) {
      return res.status(400).json({ error: "Nama siswa wajib diisi." });
    }

    const promptText = `Nama Siswa: ${studentName}
Data Listening: ${listeningData || 'Tidak ada data'}
Data Writing: ${writingData || 'Tidak ada data'}
Observasi Speaking: ${speakingObs || 'Tidak ada data'}`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY tidak ditemukan, menggunakan rule-based fallback evaluator.");
        const fallbackResult = ruleBasedEvaluation(studentName, listeningData || '', writingData || '', speakingObs || '');
        return res.json({ success: true, isFallback: true, ...fallbackResult });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              studentName: { type: Type.STRING },
              listeningColor: { type: Type.STRING, description: "Emoji warna: 🟩, 🟨, atau 🟥" },
              listeningReason: { type: Type.STRING, description: "Alasan evaluasi listening sesuai rubrik" },
              writingColor: { type: Type.STRING, description: "Emoji warna: 🟩, 🟨, atau 🟥" },
              writingReason: { type: Type.STRING, description: "Alasan evaluasi writing sesuai rubrik" },
              speakingColor: { type: Type.STRING, description: "Emoji warna: 🟩, 🟨, atau 🟥" },
              speakingReason: { type: Type.STRING, description: "Alasan evaluasi speaking sesuai rubrik" },
              overallColor: { type: Type.STRING, description: "Emoji warna mayoritas: 🟩, 🟨, atau 🟥" },
              overallLevel: { type: Type.STRING, description: "Mahir, Berkembang, atau Perlu Bimbingan" },
              recommendation: { type: Type.STRING, description: "Tindak lanjut spesifik berdasarkan level keseluruhan" },
              markdown: { type: Type.STRING, description: "Teks laporan terformat lengkap dalam Markdown sesuai Expected Output" }
            },
            required: [
              "studentName",
              "listeningColor",
              "listeningReason",
              "writingColor",
              "writingReason",
              "speakingColor",
              "speakingReason",
              "overallColor",
              "overallLevel",
              "recommendation",
              "markdown"
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Respon AI kosong.");
      }

      const evalData = JSON.parse(responseText);
      return res.json({ success: true, isFallback: false, ...evalData });

    } catch (err: any) {
      console.error("Error evaluating with Gemini API:", err);
      // Fallback to rule engine on API error
      const fallbackResult = ruleBasedEvaluation(studentName, listeningData || '', writingData || '', speakingObs || '');
      return res.json({
        success: true,
        isFallback: true,
        errorMessage: err.message || "Gagal menghubungi AI Server, menggunakan evaluator aturan lokal.",
        ...fallbackResult
      });
    }
  });

  // Evaluate batch students endpoint
  app.post("/api/evaluate-batch", async (req, res) => {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Daftar siswa wajib dikirimkan dalam bentuk array." });
    }

    const results = [];
    for (const student of students) {
      const fallbackResult = ruleBasedEvaluation(
        student.studentName || student.name,
        student.listeningData || '',
        student.writingData || '',
        student.speakingObs || ''
      );
      results.push(fallbackResult);
    }

    return res.json({ success: true, results });
  });

  // Vite middleware for dev / express static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Evaluator Diagnostik beroperasi di http://localhost:${PORT}`);
  });
}

startServer();
