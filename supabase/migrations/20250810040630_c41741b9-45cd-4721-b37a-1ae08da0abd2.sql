
-- 1) Create a per-user monthly budgets table
create table if not exists public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  -- Use 'YYYY-MM' to keep it simple and readable on the client
  month text not null,
  income numeric not null default 0,
  savings_goal numeric not null default 0,
  fixed_expenses jsonb not null default '[]',
  variable_expenses jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure each user has at most one plan per month; we’ll rely on upsert with (user_id, month)
create unique index if not exists monthly_budgets_user_month_idx
  on public.monthly_budgets (user_id, month);

-- 2) Row Level Security
alter table public.monthly_budgets enable row level security;

-- Users can view their own monthly budgets
create policy if not exists "Users can view their own monthly budgets"
  on public.monthly_budgets
  for select
  using (auth.uid() = user_id);

-- Users can insert their own monthly budgets
create policy if not exists "Users can insert their own monthly budgets"
  on public.monthly_budgets
  for insert
  with check (auth.uid() = user_id);

-- Users can update their own monthly budgets
create policy if not exists "Users can update their own monthly budgets"
  on public.monthly_budgets
  for update
  using (auth.uid() = user_id);

-- Users can delete their own monthly budgets
create policy if not exists "Users can delete their own monthly budgets"
  on public.monthly_budgets
  for delete
  using (auth.uid() = user_id);

-- 3) Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_monthly_budgets_updated_at on public.monthly_budgets;

create trigger set_monthly_budgets_updated_at
before update on public.monthly_budgets
for each row execute procedure public.set_updated_at();
