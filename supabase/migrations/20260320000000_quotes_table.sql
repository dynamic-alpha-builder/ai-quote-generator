-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Quotes table
create table if not exists public.quotes (
  id          uuid          primary key default gen_random_uuid(),
  quote_text  text          not null,
  author      text          not null default 'Unknown',
  created_at  timestamptz   not null default now()
);

-- Index for fast history retrieval (most recent first)
create index if not exists quotes_created_at_idx
  on public.quotes (created_at desc);

-- Row Level Security
alter table public.quotes enable row level security;

-- Policy: anyone (anon role) can read quotes — no auth required
create policy "Public read access"
  on public.quotes
  for select
  to anon
  using (true);

-- Policy: only the service role (server-side API) can insert quotes
create policy "Service role insert"
  on public.quotes
  for insert
  to service_role
  with check (true);
