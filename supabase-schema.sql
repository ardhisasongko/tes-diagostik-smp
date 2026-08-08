-- Supabase schema untuk Tes Diagnostik SMP
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query -> Run

create table if not exists students (
  id text primary key,
  created_at timestamp with time zone not null default timezone('utc', now()),
  data jsonb not null default '{}'::jsonb
);

create table if not exists settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb
);

-- Model: satu baris per siswa (id = id siswa) agar submit konkuren aman.