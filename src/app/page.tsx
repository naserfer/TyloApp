import { getSupabase } from "@/lib/supabase/client";
import { CatalogSection } from "@/components/CatalogSection";
import type { Product } from "@/types/database";

export const revalidate = 60;

export default async function HomePage() {
  let products: Product[] | null = null;
  let loadError: string | null = null;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    products = data ?? null;
    loadError = error?.message ?? null;
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

  const pañoletas = (products ?? []).filter((p) => p.category === "pañoletas");
  const accesorios = (products ?? []).filter((p) => p.category === "accesorios");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-center text-tylo-teal/90 text-sm mb-8 animate-page-fade opacity-0 [animation-fill-mode:forwards]">
        Elegí lo que te guste y enviá tu pedido directo por WhatsApp.
      </p>

      <CatalogSection title="Pañoletas" products={pañoletas} />
      <CatalogSection title="Accesorios" products={accesorios} />

      {(!products || products.length === 0) && (
        <p className="text-center text-tylo-teal/70 py-12 animate-page-fade opacity-0 [animation-fill-mode:forwards]">
          Pronto vas a ver los productos acá.
        </p>
      )}
    </div>
  );
}
