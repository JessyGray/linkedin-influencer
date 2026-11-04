-- LinkedIn Influencer publisher · Supabase schema
-- Run once in Supabase → SQL Editor. Then set your secret:
--   insert into li_private.config (key, value) values ('db_secret', '<same value as DB_SECRET in Vercel>');
--
-- Security model: both tables have RLS on and no policies, so the publishable key can read nothing directly.
-- The app only calls the SECURITY DEFINER functions below, and each one checks the shared secret first.

create schema if not exists li_private;
revoke all on schema li_private from public, anon, authenticated;

create table if not exists li_private.config (
  key   text primary key,
  value text not null
);

create table if not exists public.li_posts (
  id           bigint generated always as identity primary key,
  body         text not null check (char_length(body) between 1 and 3000),
  scheduled_at timestamptz not null,
  status       text not null default 'scheduled'
               check (status in ('scheduled', 'publishing', 'posted', 'failed', 'cancelled')),
  post_urn     text,
  error        text,
  created_at   timestamptz not null default now(),
  posted_at    timestamptz
);
create index if not exists li_posts_due on public.li_posts (scheduled_at) where status = 'scheduled';

create table if not exists public.li_auth (
  id           int primary key default 1 check (id = 1),
  access_token text not null,
  person_urn   text not null,
  expires_at   timestamptz not null,
  updated_at   timestamptz not null default now()
);

alter table public.li_posts enable row level security;
alter table public.li_auth  enable row level security;

create or replace function li_private.check_secret(p_secret text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_secret is null or p_secret is distinct from (select value from li_private.config where key = 'db_secret') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end $$;
revoke all on function li_private.check_secret(text) from public, anon, authenticated;

-- Auth -----------------------------------------------------------------------

create or replace function public.li_save_auth(p_secret text, p_token text, p_person_urn text, p_expires_at timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  insert into public.li_auth (id, access_token, person_urn, expires_at, updated_at)
  values (1, p_token, p_person_urn, p_expires_at, now())
  on conflict (id) do update
    set access_token = excluded.access_token, person_urn = excluded.person_urn,
        expires_at = excluded.expires_at, updated_at = now();
end $$;

create or replace function public.li_get_auth(p_secret text)
returns setof public.li_auth language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  return query select * from public.li_auth where id = 1;
end $$;

-- Queue ----------------------------------------------------------------------

create or replace function public.li_queue_add(p_secret text, p_posts jsonb)
returns setof public.li_posts language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  return query
    insert into public.li_posts (body, scheduled_at)
    select p->>'body', (p->>'scheduled_at')::timestamptz
    from jsonb_array_elements(p_posts) as p
    returning *;
end $$;

create or replace function public.li_queue_list(p_secret text)
returns setof public.li_posts language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  return query
    select * from public.li_posts
    where status in ('scheduled', 'publishing') or scheduled_at > now() - interval '30 days'
    order by scheduled_at;
end $$;

create or replace function public.li_cancel(p_secret text, p_id bigint)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  update public.li_posts set status = 'cancelled' where id = p_id and status = 'scheduled';
  return found;
end $$;

-- Claims due posts atomically. At most one post per run keeps the account at a human pace.
create or replace function public.li_claim_due(p_secret text)
returns setof public.li_posts language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  return query
    update public.li_posts set status = 'publishing'
    where id in (
      select id from public.li_posts
      where status = 'scheduled' and scheduled_at <= now()
      order by scheduled_at
      limit 1
      for update skip locked
    )
    returning *;
end $$;

create or replace function public.li_mark(p_secret text, p_id bigint, p_status text, p_urn text, p_error text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  update public.li_posts
     set status = p_status, post_urn = p_urn, error = p_error,
         posted_at = case when p_status = 'posted' then now() else posted_at end
   where id = p_id;
end $$;

create or replace function public.li_status(p_secret text)
returns json language plpgsql security definer set search_path = '' as $$
begin
  perform li_private.check_secret(p_secret);
  return json_build_object(
    'connected',  exists (select 1 from public.li_auth),
    'expires_at', (select expires_at from public.li_auth where id = 1),
    'scheduled',  (select count(*) from public.li_posts where status = 'scheduled'),
    'posted',     (select count(*) from public.li_posts where status = 'posted'),
    'failed',     (select count(*) from public.li_posts where status = 'failed'),
    'next',       (select min(scheduled_at) from public.li_posts where status = 'scheduled')
  );
end $$;
