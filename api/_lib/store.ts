import { put, list, del } from '@vercel/blob';

const PREFIX = 'students/';
const SETTINGS_PATH = 'settings.json';

const pathFor = (id: string) => `${PREFIX}${encodeURIComponent(id)}.json`;
const idFromPath = (p: string) => decodeURIComponent(p.slice(PREFIX.length, -'.json'.length));

export interface StoredStudent {
  id: string;
  studentName: string;
  className?: string;
  listeningData: any;
  writingData: any;
  speakingObs: any;
  evaluation?: any;
  status: string;
  createdAt: string;
}

export function isStoreConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getStudents(): Promise<StoredStudent[]> {
  if (!isStoreConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: PREFIX });
    if (!blobs || blobs.length === 0) return [];
    const results = await Promise.all(
      blobs.map(async (b) => {
        try {
          const sep = b.url.includes('?') ? '&' : '?';
          const res = await fetch(`${b.url}${sep}v=${Date.now()}`, { cache: 'no-store' });
          if (!res.ok) return null;
          const parsed = await res.json();
          return parsed && typeof parsed === 'object' && parsed.id ? parsed : null;
        } catch {
          return null;
        }
      })
    );
    return results.filter((r): r is StoredStudent => r !== null);
  } catch (err) {
    console.error('Blob get error:', err);
    return [];
  }
}

export async function saveStudents(students: StoredStudent[]): Promise<StoredStudent[]> {
  if (!isStoreConfigured()) return students;
  await Promise.all(
    students.map((s) =>
      put(pathFor(s.id), JSON.stringify(s), { access: 'public', allowOverwrite: true })
    )
  );
  return students;
}

export async function deleteStudent(id: string): Promise<void> {
  if (!isStoreConfigured()) return;
  await del(pathFor(id));
}

export async function getSettings(): Promise<{ teacherMode?: boolean }> {
  if (!isStoreConfigured()) return {};
  try {
    const { blobs } = await list({ prefix: SETTINGS_PATH });
    if (!blobs || blobs.length === 0) return {};
    const newest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const sep = newest.url.includes('?') ? '&' : '?';
    const res = await fetch(`${newest.url}${sep}v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return {};
    const parsed = await res.json();
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.error('Blob settings get error:', err);
    return {};
  }
}

export async function saveSettings(settings: { teacherMode: boolean }): Promise<void> {
  if (!isStoreConfigured()) return;
  await put(SETTINGS_PATH, JSON.stringify(settings), { access: 'public', allowOverwrite: true });
}
