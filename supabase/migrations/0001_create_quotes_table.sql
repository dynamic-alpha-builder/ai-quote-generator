create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  quote_text text not null,
  author text not null,
  created_at timestamptz not null default now()
);

-- Index for ordering by created_at descending
create index if not exists quotes_created_at_idx on quotes (created_at desc);
