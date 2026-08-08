import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSettings, saveSettings } from './_lib/store.js';

const EXPECTED_PIN = process.env.GURU_PIN || '2024';
// Lock kembali otomatis setelah beberapa menit (dipakai ulang di deploy untuk jangka pendek)
const UNLOCK_TTL_MS = (parseInt(process.env.GURU_UNLOCK_MINUTES || '45', 10)) * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const settings = await getSettings();
    // Default = false (mode siswa). Mode guru hanya aktif bila masih dalam jendela waktu unlock.
    const isExpired = settings.unlockedAt
      ? Date.now() - new Date(settings.unlockedAt).getTime() > UNLOCK_TTL_MS
      : settings.teacherMode !== true;
    return res.json({ success: true, teacherMode: !isExpired, unlockedAt: settings.unlockedAt });
  }

  if (req.method === 'POST') {
    const { teacherMode, pin } = req.body || {};

    if (teacherMode === false) {
      await saveSettings({ teacherMode: false, unlockedAt: undefined });
      return res.json({ success: true, teacherMode: false });
    }

    if (typeof pin === 'string' && pin === EXPECTED_PIN) {
      await saveSettings({ teacherMode: true, unlockedAt: new Date().toISOString() });
      return res.json({ success: true, teacherMode: true });
    }

    return res.status(403).json({ error: 'PIN guru salah.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}