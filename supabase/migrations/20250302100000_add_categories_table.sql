-- Tabla de categorías (admin puede agregar más)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.categories enable row level security;

create policy "Categorías visibles para todos"
  on public.categories for select
  using (true);

create policy "Admin puede gestionar categorías"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Quitar restricción fija de categorías en products para permitir cualquier slug de categories
alter table public.products drop constraint if exists products_category_check;

-- Seed categorías iniciales
insert into public.categories (name, slug, sort_order)
values
  ('Pañoletas', 'pañoletas', 1),
  ('Accesorios', 'accesorios', 2)
on conflict (slug) do nothing;

create index if not exists idx_categories_sort on public.categories(sort_order);
