import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { evaluateWithGemini, ruleBasedEvaluation } from "./api/_lib/evaluator";

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

    try {
      const result = await evaluateWithGemini(
        studentName,
        listeningData || '',
        writingData || '',
        speakingObs || ''
      );
      return res.json({ success: true, ...result });

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
