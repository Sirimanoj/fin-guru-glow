-- Enable required extension for UUID generation
create extension if not exists "pgcrypto" with schema public;

-- 1) Users table (app profiles)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  avatar_style text,
  created_at timestamptz not null default now()
);

-- RLS for users (self-access only)
alter table public.users enable row level security;
create policy if not exists "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);
create policy if not exists "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);
create policy if not exists "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);
create policy if not exists "Users can delete their own profile"
  on public.users for delete
  using (auth.uid() = id);

-- 7) Avatar library (publicly readable)
create table if not exists public.avatar_library (
  id text primary key,
  name text not null,
  bio text,
  image_url text
);

alter table public.avatar_library enable row level security;
create policy if not exists "Avatar library is readable by everyone"
  on public.avatar_library for select
  using (true);

-- 2) Chat history
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  avatar_id text not null references public.avatar_library(id),
  user_message text not null,
  ai_response text,
  "timestamp" timestamptz not null default now()
);
create index if not exists idx_chat_history_user_id_timestamp
  on public.chat_history (user_id, "timestamp" desc);

alter table public.chat_history enable row level security;
create policy if not exists "Users can view their own chats"
  on public.chat_history for select
  using (auth.uid() = user_id);
create policy if not exists "Users can insert their own chats"
  on public.chat_history for insert
  with check (auth.uid() = user_id);
create policy if not exists "Users can update their own chats"
  on public.chat_history for update
  using (auth.uid() = user_id);
create policy if not exists "Users can delete their own chats"
  on public.chat_history for delete
  using (auth.uid() = user_id);

-- 3) Expenses
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  category text not null,
  note text,
  "date" date not null default current_date
);
create index if not exists idx_expenses_user_id_date
  on public.expenses (user_id, "date" desc);

alter table public.expenses enable row level security;
create policy if not exists "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);
create policy if not exists "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);
create policy if not exists "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);
create policy if not exists "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- 4) Savings goals
create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  target_amount numeric(12,2) not null check (target_amount >= 0),
  current_amount numeric(12,2) not null default 0 check (current_amount >= 0),
  deadline date,
  created_at timestamptz not null default now()
);
create index if not exists idx_savings_goals_user_id
  on public.savings_goals (user_id);

alter table public.savings_goals enable row level security;
create policy if not exists "Users can view their own goals"
  on public.savings_goals for select
  using (auth.uid() = user_id);
create policy if not exists "Users can insert their own goals"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);
create policy if not exists "Users can update their own goals"
  on public.savings_goals for update
  using (auth.uid() = user_id);
create policy if not exists "Users can delete their own goals"
  on public.savings_goals for delete
  using (auth.uid() = user_id);

-- 5) Fin score
create table if not exists public.fin_score (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  last_updated timestamptz not null default now(),
  badges jsonb not null default '[]'::jsonb
);
create index if not exists idx_fin_score_user_id
  on public.fin_score (user_id);

alter table public.fin_score enable row level security;
create policy if not exists "Users can view their own fin score"
  on public.fin_score for select
  using (auth.uid() = user_id);
create policy if not exists "Users can insert their own fin score"
  on public.fin_score for insert
  with check (auth.uid() = user_id);
create policy if not exists "Users can update their own fin score"
  on public.fin_score for update
  using (auth.uid() = user_id);
create policy if not exists "Users can delete their own fin score"
  on public.fin_score for delete
  using (auth.uid() = user_id);

-- 6) Settings (1:1 with user)
create table if not exists public.settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  theme text,
  notifications boolean not null default true,
  preferred_avatar text references public.avatar_library(id)
);

alter table public.settings enable row level security;
create policy if not exists "Users can view their own settings"
  on public.settings for select
  using (auth.uid() = user_id);
create policy if not exists "Users can insert their own settings"
  on public.settings for insert
  with check (auth.uid() = user_id);
create policy if not exists "Users can update their own settings"
  on public.settings for update
  using (auth.uid() = user_id);
create policy if not exists "Users can delete their own settings"
  on public.settings for delete
  using (auth.uid() = user_id);

-- Trigger to keep fin_score.last_updated fresh
create or replace function public.update_last_updated()
returns trigger
language plpgsql
as $$
begin
  new.last_updated = now();
  return new;
end;
$$;

create or replace trigger update_fin_score_last_updated
before update on public.fin_score
for each row
execute function public.update_last_updated();