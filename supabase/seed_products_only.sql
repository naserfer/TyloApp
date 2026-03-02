-- Ejecutá este script en Supabase Dashboard → SQL Editor si solo querés agregar los 4 productos de prueba.
-- (Si hacés supabase db reset, el seed.sql ya los incluye.)
insert into public.products (name, description, price_guaranies, image_url, category, dimensions, variants, active, sort_order)
values
  ('SAVANNA', 'Pañoleta estampado cebra', 70000, null, 'pañoletas', '70cm x 70cm', null, true, 1),
  ('EJE', 'Pañoleta estampado geométrico', 65000, null, 'pañoletas', '60cm x 60cm', null, true, 2),
  ('SELVA', 'Pañoleta estampado leopardo', 70000, null, 'pañoletas', '65cm x 65cm', null, true, 3),
  ('AURA', 'Pañoleta estampado naranja y fucsia', 70000, null, 'pañoletas', '65cm x 65cm', null, true, 4);
