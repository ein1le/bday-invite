create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  password_hash text not null,
  is_attending boolean,
  responded_at timestamptz,
  created_at timestamptz default now()
);
