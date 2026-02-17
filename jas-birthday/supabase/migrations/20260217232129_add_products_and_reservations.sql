create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  description text,
  price numeric(10, 2) not null,
  created_at timestamptz default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  guest_id uuid not null references public.guests (id) on delete cascade,
  type text not null check (type in ('single', 'split')),
  created_at timestamptz default now()
);

create unique index if not exists reservations_product_guest_unique
  on public.reservations (product_id, guest_id);
