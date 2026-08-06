export type LevelColor = '🟩' | '🟨' | '🟥';
export type OverallTier = 'Mahir' | 'Berkembang' | 'Perlu Bimbingan';

export interface ListeningInput {
  selectedKeywords: string[]; // ['future', 'doctor', 'study', 'science', 'English', 'course', 'goal', 'help', 'improve']
  repetitionNeeded: boolean;
  repetitionCount: '0' | '1-2' | '>2';
  customNote?: string;
}

export interface WritingInput {
  text: string;
  notes?: string;
}

export interface SpeakingInput {
  tags: string[]; // e.g. ['Lancar', 'Kontak mata baik', 'Ragu-ragu', 'Bahasa Indonesia']
  customNote: string;
}

export interface EvaluationResult {
  listeningColor: LevelColor;
  listeningReason: string;
  writingColor: LevelColor;
  writingReason: string;
  speakingColor: LevelColor;
  speakingReason: string;
  overallColor: LevelColor;
  overallLevel: OverallTier;
  recommendation: string;
  markdown: string;
  evaluatedAt: string;
  isAiEvaluated?: boolean;
}

export interface StudentRecord {
  id: string;
  studentName: string;
  className?: string; // default e.g. "9A"
  listeningData: ListeningInput;
  writingData: WritingInput;
  speakingObs: SpeakingInput;
  evaluation?: EvaluationResult;
  status: 'evaluated' | 'pending';
  createdAt: string;
}

export const LISTENING_TARGET_KEYWORDS = [
  'future',
  'doctor',
  'study',
  'science',
  'English',
  'course',
  'goal',
  'help',
  'improve'
];

export const WRITING_TARGET_PATTERNS = ['want to', 'because', 'plan to'];

export const SPEAKING_QUICK_TAGS = [
  { id: 'lancar', label: 'Berbicara Lancar', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', tier: '🟩' },
  { id: 'kontak_mata', label: 'Kontak Mata Baik', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', tier: '🟩' },
  { id: 'volume_jelas', label: 'Volume Jelas', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', tier: '🟩' },
  { id: 'berinisiatif', label: 'Berinisiatif', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', tier: '🟩' },
  { id: 'ragu', label: 'Ragu-ragu/Terbata', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', tier: '🟨' },
  { id: 'perlu_dorongan', label: 'Butuh Pengulangan/Dorongan', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', tier: '🟨' },
  { id: 'enggan', label: 'Enggan Berbicara', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', tier: '🟥' },
  { id: 'bahasa_indo', label: 'Menjawab dng Bahasa Indonesia', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', tier: '🟥' },
  { id: 'bimbingan_penuh', label: 'Butuh Pendampingan Penuh', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', tier: '🟥' }
];
