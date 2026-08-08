# Project: Tes Diagnostik SMP

Aplikasi asesmen diagnostik Bahasa Inggris untuk SMP PLUS AT-THAHIRIN (Kelas 7/8/9). Guru menilai 3 aspek (Listening, Writing, Speaking) per siswa; AI (Gemini) mengevaluasi ke level warna 🟩🟨🟥 + rekomendasi tindak lanjut, dengan fallback aturan lokal bila API gagal. Terdapat mode kunci siswa (PIN) yang menyembunyikan menu guru.

## Perintah

- `npm run dev` — jalankan dev server (Express + Vite middleware) di `http://localhost:3000` (wajib Node >=20, gunakan `tsx`)
- `npm run build` — `vite build` lalu bundle `server.ts` ke `dist/server.cjs`
- `npm start` — jalankan hasil build (mode production)
- `npm run lint` — typecheck via `tsc --noEmit`
- `npm run clean` — hapus `dist` dan `server.js`

## Arsitektur

- `server.ts` — entrypoint Express dev/prod. Endpoint manual: `/api/health`, `/api/evaluate`, `/api/evaluate-batch` (dev/eksperimen).
- `api/` — Vercel serverless functions yang dipakai deploy produksi:
  - `students.ts`, `submit.ts`, `settings.ts`, `evaluate.ts`, `evaluate-batch.ts` — API routes
  - `api/_lib/store.ts` — penyimpanan di Vercel Blob. **Satu file Blob per siswa** (`students/<id>.json`) + `settings.json`; cache-buster query `?v=Date.now()` saat baca. Nonaktif bila `BLOB_READ_WRITE_TOKEN` tidak ada.
  - `api/_lib/evaluator.ts` — `SYSTEM_INSTRUCTIONS` (rubrik prompt Gemini) + `ruleBasedEvaluation()` fallback berbasis keyword. Logika evaluasi inti di sini.
- `src/` — frontend React + Vite + Tailwind v4 (`@tailwindcss/vite`) + lucide-react:
  - `App.tsx` — routing/kondisi tampilan guru vs siswa (mode kunci via `settings.teacherMode` + PIN)
  - `components/` — `ClassDashboard`, `StudentForm`, `StudentListTable`, `DiagnosticReportCard`, `RubricGuide`, `StudentPortal`, `SystemPromptModal`, `Navbar`
  - `data/` — `mockStudents.ts` (kosong, data asli dari Blob), `gradeMaterials.ts`
  - `types.ts` — tipe bersama
- `metadata.json`, `vercel.json` — konfigurasi deploy. `vite.config.ts` punya plugin Tailwind + React.

## Konvensi

- Bahasa kode & prompt AI: Bahasa Indonesia (label, pesan, evaluasi). Nama variabel: bahasa Inggris.
- ESM — import pakai ekstensi `.js` (mis. `from "./api/_lib/evaluator.js"`).
- Komentar bermakna saja; kode kompak.
- Jangan commit `.env`, API key, atau token Blob.

## Gotchas

- Serverless Vercel membutuhkan import evaluator dari `api/_lib` agar ter-bundle; jangan pindahkan.
- Lazy-load SDK Gemini (`@google/genai`) di serverless; pakai fallback `ruleBasedEvaluation` saat error.
- `DELETE /api/students` menerima id lewat query param.
- Saat baca Blob, jangan lupa cache-buster `v=Date.now()` agar data selalu segar.
- Mode kunci siswa disimpan global via Blob `settings.json`; PIN dibuka kembali oleh guru.
- Deploy produksi memakai endpoint di `api/`, bukan `server.ts`.

## Riwayat Keputusan (dari git log)

- Vercel Blob (bukan KV) untuk penyimpanan siswa; satu file per siswa agar submit konkuren aman.
- Hapus mock data agar data contoh tidak tersinkron ke penyimpanan bersama.
- Mode kunci siswa: sembunyikan menu guru, dibuka via PIN.
