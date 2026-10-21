create type public.app_role as enum ('admin');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.first_user_admin() returns trigger language plpgsql security definer set search_path = public as $$ begin if not exists (select 1 from public.user_roles where role='admin') then insert into public.user_roles(user_id, role) values (new.id,'admin'); end if; return new; end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.first_user_admin();

create table public.pilot_applications (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 full_name text not null, email text not null, company text not null, website text, role text not null,
 company_type text not null, claim_volume text not null, challenge text not null, consent boolean not null,
 source_article text, status text not null default 'new');
grant select, update on public.pilot_applications to authenticated; grant all on public.pilot_applications to service_role;
alter table public.pilot_applications enable row level security;
create policy "admins read apps" on public.pilot_applications for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update apps" on public.pilot_applications for update to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.analytics_events (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 session_id text not null, event text not null, article text, value numeric, meta jsonb);
create index on public.analytics_events(created_at); create index on public.analytics_events(event);
grant select on public.analytics_events to authenticated; grant all on public.analytics_events to service_role;
alter table public.analytics_events enable row level security;
create policy "admins read events" on public.analytics_events for select to authenticated using (public.has_role(auth.uid(),'admin'));