-- Repit — schema para histórico de visualização e favoritos por usuário.
-- Rode este script no SQL Editor do seu projeto Supabase (Project -> SQL Editor -> New query).
-- Pode rodar de novo com segurança: usa "if not exists" e "or replace" onde possível.

create extension if not exists "pgcrypto";

-- ─── Histórico de visualização ─────────────────────────────────────
create table if not exists public.history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id text not null,
  title text,
  thumbnail_url text,
  loop_start numeric,
  loop_end numeric,
  speed numeric,
  watched_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create index if not exists history_user_watched_idx
  on public.history (user_id, watched_at desc);

alter table public.history enable row level security;

drop policy if exists "history_select_own" on public.history;
create policy "history_select_own" on public.history
  for select using (auth.uid() = user_id);

drop policy if exists "history_insert_own" on public.history;
create policy "history_insert_own" on public.history
  for insert with check (auth.uid() = user_id);

drop policy if exists "history_update_own" on public.history;
create policy "history_update_own" on public.history
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "history_delete_own" on public.history;
create policy "history_delete_own" on public.history
  for delete using (auth.uid() = user_id);

-- ─── Favoritos ──────────────────────────────────────────────────────
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id text not null,
  title text,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create index if not exists favorites_user_created_idx
  on public.favorites (user_id, created_at desc);

alter table public.favorites enable row level security;

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_update_own" on public.favorites;
create policy "favorites_update_own" on public.favorites
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- ─── Trechos favoritos (clipes de um vídeo) ────────────────────────
-- Diferente de "favorites": aqui o mesmo vídeo pode aparecer várias vezes,
-- um registro por trecho salvo (início/fim diferentes).
create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id text not null,
  title text,
  thumbnail_url text,
  label text,
  start_time numeric not null,
  end_time numeric not null,
  speed numeric,
  created_at timestamptz not null default now()
);

create index if not exists clips_user_created_idx
  on public.clips (user_id, created_at desc);

alter table public.clips enable row level security;

drop policy if exists "clips_select_own" on public.clips;
create policy "clips_select_own" on public.clips
  for select using (auth.uid() = user_id);

drop policy if exists "clips_insert_own" on public.clips;
create policy "clips_insert_own" on public.clips
  for insert with check (auth.uid() = user_id);

drop policy if exists "clips_update_own" on public.clips;
create policy "clips_update_own" on public.clips
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clips_delete_own" on public.clips;
create policy "clips_delete_own" on public.clips
  for delete using (auth.uid() = user_id);
