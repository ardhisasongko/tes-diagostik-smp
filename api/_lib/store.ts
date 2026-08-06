import { put, list } from '@vercel/blob';

const STUDENTS_PATH = 'students.json';

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

async function persist(records: StoredStudent[]): Promise<void> {
  if (!isStoreConfigured()) return;
  await put(STUDENTS_PATH, JSON.stringify(records), {
    access: 'public',
    allowOverwrite: true
  });
}

export async function getStudents(): Promise<StoredStudent[]> {
  if (!isStoreConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: STUDENTS_PATH });
    if (!blobs || blobs.length === 0) return [];
    const newest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const sep = newest.url.includes('?') ? '&' : '?';
    const res = await fetch(`${newest.url}${sep}v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const parsed = await res.json();
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Blob get error:', err);
    return [];
  }
}

export async function saveStudents(students: StoredStudent[]): Promise<StoredStudent[]> {
  const existing = await getStudents();
  const merged = new Map<string, StoredStudent>();
  for (const s of existing) merged.set(s.id, s);
  for (const s of students) merged.set(s.id, s);
  const result = Array.from(merged.values());
  await persist(result);
  return result;
}

export async function upsertStudent(student: StoredStudent): Promise<StoredStudent[]> {
  const existing = await getStudents();
  const idx = existing.findIndex((s) => s.id === student.id);
  if (idx >= 0) existing[idx] = student;
  else existing.unshift(student);
  await persist(existing);
  return existing;
}
