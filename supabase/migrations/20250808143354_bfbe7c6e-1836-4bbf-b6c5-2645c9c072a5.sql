-- Fix linter: set search_path and security definer for trigger function
create or replace function public.update_last_updated()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.last_updated = now();
  return new;
end;
$$;