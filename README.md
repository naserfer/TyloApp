# Tylo — Catálogo y pedidos por WhatsApp

App web para pañoletas y accesorios. Los clientes ven el catálogo, agregan al carrito y envían el pedido por WhatsApp. La admin gestiona productos desde un panel con login.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind
- **Supabase**: base de datos, auth para admin, opcionalmente storage para imágenes
- **Vercel**: deploy

## Setup

### 1. Instalar y variables de entorno

```bash
npm install
cp .env.local.example .env.locall
```

En `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto (ej. `https://ffmgmtmdxnikepypnnzl.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon key de Supabase
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número con código de país, sin + (ej. `595981123456`). Opcional si se configura desde Admin > Config.

### 2. Supabase

1. En el proyecto de Supabase, **SQL Editor** → New query. Pegar y ejecutar el contenido de `supabase/schema.sql`.
2. **Authentication > Users**: crear un usuario (email + contraseña) para la admin. Ese usuario será el único que pueda entrar a `/admin`.
3. (Opcional) **Storage**: crear un bucket público `product-images` para subir fotos y usar las URLs en los productos.

### 3. Desarrollo

```bash
npm run dev
```

- Tienda: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` (login con el usuario creado en Supabase)

### 4. Deploy en Vercel

- Conectar el repo a Vercel y agregar las mismas variables de entorno.
- Build: `npm run build`.

## Uso

- **Clientes**: entran a la web, ven pañoletas y accesorios, agregan al carrito. En “Ver carrito” pueden editar cantidades y tocar “Enviar pedido por WhatsApp” para abrir WhatsApp con el mensaje armado.
- **Admin**: entra a `/admin`, inicia sesión. En **Productos** puede crear, editar, ocultar y eliminar productos. En **Config** puede guardar el número de WhatsApp (si no se usa la variable de entorno).

## Estructura

- `src/app`: páginas (catálogo, carrito, admin).
- `src/components`: Header, ProductCard, CartBar.
- `src/context`: CartContext (carrito en memoria + localStorage).
- `src/lib/supabase`: cliente Supabase.
- `src/types`: tipos de la base.
