"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (!error) setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  async function toggleActive(p: Product) {
    const supabase = getSupabase();
    await supabase
      .from("products")
      .update({ active: !p.active })
      .eq("id", p.id);
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x))
    );
  }

  if (loading) {
    return <p className="text-tylo-teal">Cargando productos...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-tylo-text">Productos</h1>
        <Link
          href="/admin/productos/nueva"
          className="py-2 px-4 rounded-lg bg-tylo-teal text-white text-sm font-medium"
        >
          Nuevo producto
        </Link>
      </div>

      <ul className="space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 bg-white rounded-xl border border-tylo-teal/10 p-3"
          >
            <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-tylo-cream shrink-0">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-tylo-teal/30 text-xs">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-tylo-text">{p.name}</p>
              <p className="text-sm text-tylo-teal">
                Gs. {p.price_guaranies.toLocaleString("es-PY")}
                {p.category === "pañoletas" && p.dimensions && ` · ${p.dimensions}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleActive(p)}
                className={`text-xs px-2 py-1 rounded ${p.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
              >
                {p.active ? "Visible" : "Oculta"}
              </button>
              <Link
                href={`/admin/productos/${p.id}/editar`}
                className="text-sm text-tylo-teal hover:underline"
              >
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <p className="text-tylo-teal/70 py-8 text-center">
          No hay productos. Creá el primero desde &quot;Nuevo producto&quot;.
        </p>
      )}
    </div>
  );
}
