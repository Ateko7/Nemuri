create table if not exists public.client_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  parent_name text,
  baby_name text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_key text not null,
  question_title text not null,
  answer text not null,
  step_index integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_key)
);

create table if not exists public.sleep_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  label text not null,
  event_time timestamptz not null default now(),
  source text not null default 'dashboard'
);

alter table public.client_profiles enable row level security;
alter table public.interview_answers enable row level security;
alter table public.sleep_events enable row level security;

create policy "profiles_select_own"
on public.client_profiles for select
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.client_profiles for insert
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.client_profiles for update
using (auth.uid() = user_id);

create policy "answers_select_own"
on public.interview_answers for select
using (auth.uid() = user_id);

create policy "answers_insert_own"
on public.interview_answers for insert
with check (auth.uid() = user_id);

create policy "answers_update_own"
on public.interview_answers for update
using (auth.uid() = user_id);

create policy "sleep_events_select_own"
on public.sleep_events for select
using (auth.uid() = user_id);

create policy "sleep_events_insert_own"
on public.sleep_events for insert
with check (auth.uid() = user_id);
