import type { VercelRequest, VercelResponse } from '@vercel/node';
import { evaluateWithGemini, ruleBasedEvaluation } from '../shared/evaluator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentName, listeningData, writingData, speakingObs } = req.body || {};

  if (!studentName) {
    return res.status(400).json({ error: 'Nama siswa wajib diisi.' });
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
    console.error('Error evaluating with Gemini API:', err);
    const fallbackResult = ruleBasedEvaluation(studentName, listeningData || '', writingData || '', speakingObs || '');
    return res.json({
      success: true,
      isFallback: true,
      errorMessage: err.message || 'Gagal menghubungi AI Server, menggunakan evaluator aturan lokal.',
      ...fallbackResult
    });
  }
}
