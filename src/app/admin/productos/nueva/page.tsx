"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import type { Category } from "@/types/database";

export default function NuevaProductoPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_guaranies: "",
    image_url: "",
    category: "",
    dimensions: "",
    variants: "",
  });

  useEffect(() => {
    getSupabase()
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const list = (data as Category[]) ?? [];
        setCategories(list);
        if (list.length > 0 && !form.category) setForm((f) => ({ ...f, category: list[0].slug }));
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const price = parseInt(form.price_guaranies.replace(/\D/g, ""), 10);
    if (isNaN(price) || price < 0) {
      setError("Precio inválido.");
      setSaving(false);
      return;
    }
    const supabase = getSupabase();
    const { error: err } = await supabase.from("products").insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_guaranies: price,
      image_url: form.image_url.trim() || null,
      category: form.category.trim(),
      dimensions: form.dimensions.trim() || null,
      variants: form.variants.trim() || null,
      active: true,
      sort_order: 0,
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-tylo-teal mb-4 inline-block">
        ← Volver a productos
      </Link>
      <h1 className="text-xl font-bold text-tylo-text mb-6">Nuevo producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Categoría
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
            required
          >
            {categories.length === 0 && <option value="">Cargando...</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Precio (Gs.) *
          </label>
          <input
            type="text"
            value={form.price_guaranies}
            onChange={(e) =>
              setForm((f) => ({ ...f, price_guaranies: e.target.value }))
            }
            placeholder="70000"
            required
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Medidas (ej. 70cm x 70cm)
          </label>
          <input
            type="text"
            value={form.dimensions}
            onChange={(e) =>
              setForm((f) => ({ ...f, dimensions: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Variantes (ej. Plateado, Dorado)
          </label>
          <input
            type="text"
            value={form.variants}
            onChange={(e) =>
              setForm((f) => ({ ...f, variants: e.target.value }))
            }
            placeholder="Separadas por coma"
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <ProductImageUpload
          value={form.image_url}
          onChange={(url) =>
            setForm((f) => ({ ...f, image_url: url }))
          }
          disabled={saving}
          onUploadingChange={setImageUploading}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="py-2 px-4 rounded-lg bg-tylo-teal text-white font-medium disabled:opacity-60"
          >
            {saving ? "Guardando..." : imageUploading ? "Esperando imagen..." : "Guardar"}
          </button>
          <Link
            href="/admin/productos"
            className="py-2 px-4 rounded-lg border border-tylo-teal/30 text-tylo-teal"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
