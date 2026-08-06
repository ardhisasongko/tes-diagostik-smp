import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStudents, saveStudents, isStoreConfigured } from './_lib/store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const students = await getStudents();
    return res.json({ success: true, students, storeConfigured: isStoreConfigured() });
  }

  if (req.method === 'POST') {
    const { records } = req.body || {};
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Daftar siswa wajib dikirimkan dalam bentuk array (records).' });
    }
    const merged = await saveStudents(records);
    return res.json({ success: true, students: merged, storeConfigured: isStoreConfigured() });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
