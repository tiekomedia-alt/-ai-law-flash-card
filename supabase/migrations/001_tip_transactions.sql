-- Run this in your Supabase SQL editor:
-- Dashboard → SQL Editor → New query → paste and run

create table if not exists tip_transactions (
  id           uuid primary key default gen_random_uuid(),
  reference    text unique not null,
  email        text not null,
  amount       integer not null,        -- in currency subunits (e.g. kobo, cents)
  amount_usd   numeric(10, 2) not null, -- original USD amount user selected
  currency     text not null,           -- e.g. 'NGN', 'USD', 'GHS'
  country_code text not null default 'US',
  status       text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  created_at   timestamptz not null default now(),
  verified_at  timestamptz
);

-- Index for fast lookups by reference (used in verify + webhook)
create index if not exists tip_transactions_reference_idx on tip_transactions (reference);

-- Row Level Security: only the service role key can read/write (webhook + verify routes)
alter table tip_transactions enable row level security;

-- No public access — all reads/writes go through the service role key in API routes
