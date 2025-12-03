-- Create public avatars bucket if it doesn't exist and add secure policies
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read access for avatar images
create policy if not exists "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

-- Users can upload their own avatar into a folder with their user id
create policy if not exists "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
create policy if not exists "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
create policy if not exists "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add avatar_url to users table if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'avatar_url'
  ) then
    alter table public.users add column avatar_url text;
  end if;
end $$;

-- Add currency and monthly_budget_goal to settings if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'settings' and column_name = 'currency'
  ) then
    alter table public.settings add column currency text default 'USD';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'settings' and column_name = 'monthly_budget_goal'
  ) then
    alter table public.settings add column monthly_budget_goal numeric default 0;
  end if;
end $$;