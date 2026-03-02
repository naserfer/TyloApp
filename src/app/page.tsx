import { getSupabase } from "@/lib/supabase/client";
import { CatalogWithTabs } from "@/components/CatalogWithTabs";
import type { Product } from "@/types/database";
import type { Category } from "@/types/database";

export const revalidate = 60;

export default async function HomePage() {
  let products: Product[] | null = null;
  let categories: Category[] | null = null;
  let loadError: string | null = null;

  try {
    const supabase = getSupabase();
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    ]);
    products = productsRes.data ?? null;
    categories = categoriesRes.data ?? null;
    loadError = productsRes.error?.message ?? categoriesRes.error?.message ?? null;
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Error al conectar";
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-red-600">
        No se pudieron cargar los productos. Revisá la conexión a la base de datos.
      </div>
    );
  }

  return (
    <CatalogWithTabs
      categories={categories ?? []}
      products={products ?? []}
    />
  );
}
