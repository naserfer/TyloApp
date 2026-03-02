-- ============================================================
-- Usuario admin de prueba para desarrollo / testing
-- Email: admin@tylo.com  |  Contraseña: admin123
-- ============================================================
-- Se ejecuta con: supabase db reset  o la primera vez con supabase start
-- Requiere extensión pgcrypto (Supabase la incluye por defecto)
-- ============================================================

create extension if not exists pgcrypto;

do $$
declare
  v_admin_id uuid := gen_random_uuid();
  v_instance_id uuid;
begin
  -- instance_id del proyecto (local o remoto)
  select id into v_instance_id from auth.instances limit 1;
  if v_instance_id is null then
    v_instance_id := '00000000-0000-0000-0000-000000000000';
  end if;

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    v_admin_id,
    v_instance_id,
    'authenticated',
    'authenticated',
    'admin@tylo.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin Tylo"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    v_admin_id,
    v_admin_id,
    format('{"sub":"%s","email":"admin@tylo.com"}', v_admin_id)::jsonb,
    'email',
    v_admin_id::text,
    now(),
    now(),
    now()
  );
end $$;

-- ============================================================
-- Productos de prueba (4 pañoletas)
-- Las imágenes se pueden subir desde el admin (Elegir foto)
-- ============================================================
insert into public.products (name, description, price_guaranies, image_url, category, dimensions, variants, active, sort_order)
values
  ('SAVANNA', 'Pañoleta estampado cebra', 70000, null, 'pañoletas', '70cm x 70cm', null, true, 1),
  ('EJE', 'Pañoleta estampado geométrico', 65000, null, 'pañoletas', '60cm x 60cm', null, true, 2),
  ('SELVA', 'Pañoleta estampado leopardo', 70000, null, 'pañoletas', '65cm x 65cm', null, true, 3),
  ('AURA', 'Pañoleta estampado naranja y fucsia', 70000, null, 'pañoletas', '65cm x 65cm', null, true, 4);
