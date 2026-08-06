import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSettings, saveSettings } from './_lib/store.js';

const EXPECTED_PIN = process.env.GURU_PIN || '2024';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const settings = await getSettings();
    return res.json({ success: true, teacherMode: settings.teacherMode !== false });
  }

  if (req.method === 'POST') {
    const { teacherMode, pin } = req.body || {};

    if (teacherMode === false) {
      await saveSettings({ teacherMode: false });
      return res.json({ success: true, teacherMode: false });
    }

    if (typeof pin === 'string' && pin === EXPECTED_PIN) {
      await saveSettings({ teacherMode: true });
      return res.json({ success: true, teacherMode: true });
    }

    return res.status(403).json({ error: 'PIN guru salah.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
