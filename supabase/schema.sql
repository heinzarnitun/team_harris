-- EcoLoop schema (run against Supabase Postgres)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  trust_score integer not null default 80,
  verified boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  price numeric not null,
  original_price numeric,
  category text not null,
  image_url text,
  distance text,
  location text,
  ai_condition_score integer,
  ai_condition_label text,
  co2_saved_kg numeric,
  defects jsonb not null default '[]'::jsonb,
  trading_type text not null check (trading_type in ('sale', 'barter', 'free')),
  meta jsonb not null default '{}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (product_id, buyer_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  text text not null,
  offer_amount numeric,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "products readable" on public.products;
create policy "products readable" on public.products for select using (true);
drop policy if exists "products insert own" on public.products;
create policy "products insert own" on public.products for insert with check (auth.uid() = user_id);
drop policy if exists "products update own" on public.products;
create policy "products update own" on public.products for update using (auth.uid() = user_id);
drop policy if exists "products delete own" on public.products;
create policy "products delete own" on public.products for delete using (auth.uid() = user_id);

drop policy if exists "chats participants" on public.chats;
create policy "chats participants" on public.chats for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
drop policy if exists "chats insert buyer" on public.chats;
create policy "chats insert buyer" on public.chats for insert
  with check (auth.uid() = buyer_id);

drop policy if exists "messages participants" on public.messages;
create policy "messages participants" on public.messages for select
  using (
    exists (
      select 1 from public.chats c
      where c.id = chat_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
drop policy if exists "messages insert participants" on public.messages;
create policy "messages insert participants" on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.chats c
      where c.id = chat_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
