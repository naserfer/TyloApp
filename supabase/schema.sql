-- Tabla de productos (pañoletas y accesorios)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_guaranies integer not null check (price_guaranies >= 0),
  image_url text,
  category text not null check (category in ('pañoletas', 'accesorios')),
  dimensions text,
  variants text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Config del sitio (ej: número de WhatsApp)
create table if not exists public.site_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- RLS: todos pueden leer productos activos
alter table public.products enable row level security;
alter table public.site_config enable row level security;

create policy "Productos visibles para todos"
  on public.products for select
  using (active = true);

-- Solo usuarios autenticados pueden insertar/actualizar/borrar productos
create policy "Admin puede gestionar productos"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Todos pueden leer site_config (ej. número WA)
create policy "Config pública de lectura"
  on public.site_config for select
  using (true);

create policy "Admin puede gestionar config"
  on public.site_config for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Índices
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active_sort on public.products(active, sort_order);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Storage para imágenes de productos (crear bucket "product-images" en Supabase Dashboard si no existe)
-- Política: público puede leer, solo autenticados pueden subir/borrar
