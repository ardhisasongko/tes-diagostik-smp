import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
  return client;
}

export interface StoredStudent {
  id: string;
  [key: string]: any;
}

export interface TeacherSettings {
  teacherMode?: boolean;
  unlockedAt?: string;
}

export function isStoreConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

// Tabel: students(id, created_at, data) — satu baris per siswa agar submit konkuren aman
export async function getStudents(): Promise<StoredStudent[]> {
  if (!isStoreConfigured()) return [];
  try {
    const { data, error } = await db().from('students').select('data').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getStudents error:', error);
      return [];
    }
    return (data || []).map((row) => row.data).filter((s) => s && s.id);
  } catch (err) {
    console.error('Supabase getStudents error:', err);
    return [];
  }
}

export async function saveStudents(students: StoredStudent[]): Promise<StoredStudent[]> {
  if (!isStoreConfigured()) return students;
  const rows = students.map((s) => ({
    id: s.id,
    created_at: s.createdAt || new Date().toISOString(),
    data: s
  }));
  const { error } = await db().from('students').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Supabase saveStudents error:', error);
  }
  return students;
}

export async function deleteStudent(id: string): Promise<void> {
  if (!isStoreConfigured()) return;
  await db().from('students').delete().eq('id', id);
}

export async function getSettings(): Promise<TeacherSettings> {
  if (!isStoreConfigured()) return {};
  try {
    const { data, error } = await db().from('settings').select('data').eq('key', 'app').maybeSingle();
    if (error) {
      console.error('Supabase settings get error:', error);
      return {};
    }
    return (data?.data as TeacherSettings) || {};
  } catch (err) {
    console.error('Supabase settings get error:', err);
    return {};
  }
}

export async function saveSettings(settings: TeacherSettings): Promise<void> {
  if (!isStoreConfigured()) return;
  await db()
    .from('settings')
    .upsert({ key: 'app', data: settings }, { onConflict: 'key' });
}