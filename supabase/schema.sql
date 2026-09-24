-- Run this once in the Supabase SQL editor for the HIVE project.
create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  cover_url text,
  body text not null,
  category text not null check (category in ('Build', 'Operate', 'Evolve')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  pinned boolean not null default false,
  reading_minutes integer not null default 1 check (reading_minutes > 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists only_one_pinned_post on public.posts (pinned) where pinned = true;
create index if not exists posts_public_order on public.posts (status, pinned desc, published_at desc);

alter table public.posts enable row level security;
drop policy if exists "Public can read published stories" on public.posts;
create policy "Public can read published stories"
  on public.posts for select to anon
  using (status = 'published');

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;
-- There are no public waitlist policies. Only the server's service role can write.

-- Safe for an existing posts table.
alter table public.posts add column if not exists cover_url text;
