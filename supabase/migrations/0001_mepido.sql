-- Me Pido schema. Run in Supabase SQL editor, then add `mepido` to
-- Project Settings → Data API → Exposed schemas.
-- No auth by design: anon role has full read/write access.

create schema if not exists mepido;

grant usage on schema mepido to anon, authenticated, service_role;

create table if not exists mepido.wishlists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 1 and 120),
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mepido.items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references mepido.wishlists(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  price_string text,
  url text,
  image_url text not null,
  is_starred boolean not null default false,
  quantity integer not null default 1 check (quantity between 1 and 99),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_wishlist_position_idx
  on mepido.items (wishlist_id, position);

create or replace function mepido.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wishlists_touch on mepido.wishlists;
create trigger wishlists_touch before update on mepido.wishlists
  for each row execute function mepido.touch_updated_at();

drop trigger if exists items_touch on mepido.items;
create trigger items_touch before update on mepido.items
  for each row execute function mepido.touch_updated_at();

grant select, insert, update, delete on all tables in schema mepido
  to anon, authenticated, service_role;

alter table mepido.wishlists enable row level security;
alter table mepido.items enable row level security;

drop policy if exists "open access" on mepido.wishlists;
create policy "open access" on mepido.wishlists
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "open access" on mepido.items;
create policy "open access" on mepido.items
  for all to anon, authenticated using (true) with check (true);

-- Storage: public bucket for uploaded item images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'item-images', 'item-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "mepido item-images read" on storage.objects;
create policy "mepido item-images read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'item-images');

drop policy if exists "mepido item-images upload" on storage.objects;
create policy "mepido item-images upload" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'item-images');
