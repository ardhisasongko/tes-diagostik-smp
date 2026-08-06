const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const STUDENTS_KEY = 'students';

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
  return Boolean(KV_URL && KV_TOKEN);
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (!isStoreConfigured()) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result === null || data.result === undefined) return null;
    return JSON.parse(data.result) as T;
  } catch (err) {
    console.error('KV get error:', err);
    return null;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (!isStoreConfigured()) return;
  try {
    await fetch(`${KV_URL}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(value)
    });
  } catch (err) {
    console.error('KV set error:', err);
  }
}

export async function getStudents(): Promise<StoredStudent[]> {
  const students = await kvGet<StoredStudent[]>(STUDENTS_KEY);
  return Array.isArray(students) ? students : [];
}

export async function saveStudents(students: StoredStudent[]): Promise<StoredStudent[]> {
  const existing = await getStudents();
  const merged = new Map<string, StoredStudent>();
  for (const s of existing) merged.set(s.id, s);
  for (const s of students) merged.set(s.id, s);
  const result = Array.from(merged.values());
  await kvSet(STUDENTS_KEY, result);
  return result;
}

export async function upsertStudent(student: StoredStudent): Promise<StoredStudent[]> {
  const existing = await getStudents();
  const idx = existing.findIndex((s) => s.id === student.id);
  if (idx >= 0) existing[idx] = student;
  else existing.unshift(student);
  await kvSet(STUDENTS_KEY, existing);
  return existing;
}
