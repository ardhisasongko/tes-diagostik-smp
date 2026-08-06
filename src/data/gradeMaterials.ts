export interface GradeMaterial {
  grade: '7' | '8' | '9';
  gradeLabel: string;
  title: string;
  listeningScript: string;
  listeningKeywords: string[];
  listeningInstruction: string;
  writingTitle: string;
  writingInstruction: string;
  writingTargetPatterns: string[];
  writingPlaceholder: string;
  writingTips: string;
  speakingTitle: string;
  speakingInstruction: string;
}

export const GRADE_MATERIALS: Record<'7' | '8' | '9', GradeMaterial> = {
  '7': {
    grade: '7',
    gradeLabel: 'Kelas 7',
    title: 'My Family',
    listeningScript: 'Hello, my name is Dina. I have a small family. My father is a teacher and my mother is a nurse. I have one brother. His name is Budi. We live in a small house near the school. I love my family very much.',
    listeningKeywords: ['family', 'teacher', 'nurse', 'brother', 'house'],
    listeningInstruction: 'Dengarkan teks audio tentang "My Family", lalu centang 5 kata kunci yang kamu dengar dari rekaman:',
    writingTitle: 'Bagian 2: Writing (Menulis 5 Kalimat)',
    writingInstruction: 'Tuliskan 5 kalimat Bahasa Inggris sederhana tentang diri dan anggota keluargamu (My Family).',
    writingTargetPatterns: ['my name is', 'is a', 'have', 'live in', 'love'],
    writingPlaceholder: `Contoh tulisan:\n1. My name is Dina and I am a student.\n2. My father is a teacher at school.\n3. My mother is a nurse at the hospital.\n4. We live in a small house near the school.\n5. I love my family very much.`,
    writingTips: 'Gunakan kata-kata sederhana seperti: "is a", "have/has", "live in", atau "love".',
    speakingTitle: 'Bagian 3: Refleksi Berbicara (Speaking)',
    speakingInstruction: 'Pilih kondisi yang paling menggambarkan dirimu saat mencoba menceritakan keluarga / memperkenalkan diri dalam Bahasa Inggris:'
  },
  '8': {
    grade: '8',
    gradeLabel: 'Kelas 8',
    title: 'My Weekend',
    listeningScript: 'Last weekend, my friends and I went to the beach. We swam in the sea and played volleyball. After that, we ate fried rice at a small restaurant. It was tiring but very fun. I want to go there again next month.',
    listeningKeywords: ['weekend', 'beach', 'swam', 'volleyball', 'restaurant'],
    listeningInstruction: 'Dengarkan teks audio tentang "My Weekend", lalu centang 5 kata kunci yang kamu dengar dari rekaman:',
    writingTitle: 'Bagian 2: Writing (Menulis 5 Kalimat)',
    writingInstruction: 'Tuliskan 5 kalimat Bahasa Inggris tentang pengalaman liburan atau kegiatan akhir pekanmu (Simple Past / Recount).',
    writingTargetPatterns: ['last weekend', 'went to', 'played', 'ate', 'was'],
    writingPlaceholder: `Contoh tulisan:\n1. Last weekend, I went to the beach with my family.\n2. We swam in the sea and played volleyball.\n3. We ate delicious fried rice at a restaurant.\n4. It was tiring but very fun.\n5. I want to visit that place again.`,
    writingTips: 'Gunakan kata kerja bentuk lampau (Past Tense) seperti: "went to", "swam", "played", "ate", atau "was".',
    speakingTitle: 'Bagian 3: Refleksi Berbicara (Speaking)',
    speakingInstruction: 'Pilih kondisi yang paling menggambarkan dirimu saat menceritakan pengalaman liburan / kegiatan lalu:'
  },
  '9': {
    grade: '9',
    gradeLabel: 'Kelas 9',
    title: 'Future Plans & Hobbies',
    listeningScript: 'Hello everyone! Welcome to Grade 9 English class. Today, I want to talk about my future plans. After graduating, I plan to attend a vocational school to study digital technology. In my spare time, I love listening to music, reading comic books, and taking pictures with my camera. I also practice speaking English every day because I want to join an international exchange program next year. What are your plans?',
    listeningKeywords: ['vocational school', 'digital technology', 'comic books', 'camera', 'exchange program'],
    listeningInstruction: 'Dengarkan teks audio tentang "Future Plans & Hobbies", lalu centang 5 kata kunci yang kamu dengar dari rekaman:',
    writingTitle: 'Bagian 2: Writing (Menulis 5 Kalimat)',
    writingInstruction: 'Tuliskan 5 kalimat Bahasa Inggris sederhana tentang cita-cita / rencana masa depanmu (Future Plans).',
    writingTargetPatterns: ['want to', 'because', 'plan to'],
    writingPlaceholder: `Contoh tulisan:\n1. I want to be a doctor in the future.\n2. I study science every day because I love biology.\n3. I plan to take an English course to improve my speaking.\n4. My goal is to help many people in my town.\n5. I study hard to achieve my dream.`,
    writingTips: 'Cobalah gunakan frasa penghubung: "want to", "because", atau "plan to".',
    speakingTitle: 'Bagian 3: Refleksi Berbicara (Speaking)',
    speakingInstruction: 'Pilih kondisi yang paling menggambarkan dirimu saat menceritakan cita-cita / pendapat:'
  }
};
