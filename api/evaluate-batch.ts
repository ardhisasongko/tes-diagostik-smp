import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ruleBasedEvaluation } from './_lib/evaluator.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { students } = req.body || {};
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Daftar siswa wajib dikirimkan dalam bentuk array.' });
  }

  const results = students.map((student: any) =>
    ruleBasedEvaluation(
      student.studentName || student.name,
      student.listeningData || '',
      student.writingData || '',
      student.speakingObs || ''
    )
  );

  return res.json({ success: true, results });
}
