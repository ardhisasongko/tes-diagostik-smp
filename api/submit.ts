import type { VercelRequest, VercelResponse } from '@vercel/node';
import { evaluateWithGemini, ruleBasedEvaluation } from './_lib/evaluator.js';
import { saveStudents, isStoreConfigured } from './_lib/store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, studentName, className, listeningData, writingData, speakingObs, createdAt } = req.body || {};

  if (!studentName) {
    return res.status(400).json({ error: 'Nama siswa wajib diisi.' });
  }

  const recordId = id || `std-${Date.now()}`;
  const now = new Date().toISOString();

  const listeningText = Array.isArray(listeningData?.selectedKeywords)
    ? `Dicentang ${listeningData.selectedKeywords.length} kata: ${listeningData.selectedKeywords.join(', ')}. Status pengulangan: ${listeningData.repetitionCount || '0'} kali. Catatan: ${listeningData.customNote || '-'}`
    : String(listeningData || '');

  const speakingText = Array.isArray(speakingObs?.tags)
    ? `Tag: ${speakingObs.tags.join(', ')}. Catatan: ${speakingObs.customNote || '-'}`
    : String(speakingObs || '');

  const writingText =
    typeof writingData === 'string' ? writingData : String(writingData?.text || '');

  let evaluation: any;
  let isFallback = false;
  try {
    evaluation = await evaluateWithGemini(studentName, listeningText, writingText, speakingText);
  } catch (err: any) {
    isFallback = true;
    evaluation = ruleBasedEvaluation(studentName, listeningText, writingText, speakingText);
    evaluation.errorMessage = err.message || 'Gagal menghubungi AI Server.';
  }

  const record = {
    id: recordId,
    studentName,
    className: className || '9A',
    listeningData,
    writingData,
    speakingObs,
    status: 'evaluated',
    createdAt: createdAt || now,
    evaluation: {
      ...evaluation,
      evaluatedAt: now,
      isAiEvaluated: !isFallback
    }
  };

  await saveStudents([record]);

  return res.json({ success: true, student: record, storeConfigured: isStoreConfigured() });
}
