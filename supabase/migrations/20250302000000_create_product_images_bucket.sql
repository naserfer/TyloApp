-- Bucket público para imágenes de productos (admin sube desde el celu/PC)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Cualquiera puede ver las imágenes (catálogo público)
create policy "Product images are public"
on storage.objects for select
to public
using (bucket_id = 'product-images');

-- Solo usuarios autenticados (admin) pueden subir, actualizar y borrar
create policy "Admin can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "Admin can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images');

create policy "Admin can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
