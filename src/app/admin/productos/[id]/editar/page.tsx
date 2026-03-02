"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import type { Product } from "@/types/database";

export default function EditarProductoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_guaranies: "",
    image_url: "",
    category: "pañoletas" as "pañoletas" | "accesorios",
    dimensions: "",
    variants: "",
    active: true,
  });

  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setLoading(false);
          return;
        }
        setProduct(data);
        setForm({
          name: data.name,
          description: data.description ?? "",
          price_guaranies: String(data.price_guaranies),
          image_url: data.image_url ?? "",
          category: data.category,
          dimensions: data.dimensions ?? "",
          variants: data.variants ?? "",
          active: data.active,
        });
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setError("");
    setSaving(true);
    const price = parseInt(form.price_guaranies.replace(/\D/g, ""), 10);
    if (isNaN(price) || price < 0) {
      setError("Precio inválido.");
      setSaving(false);
      return;
    }
    const supabase = getSupabase();
    const { error: err } = await supabase
      .from("products")
      .update({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price_guaranies: price,
        image_url: form.image_url.trim() || null,
        category: form.category,
        dimensions: form.dimensions.trim() || null,
        variants: form.variants.trim() || null,
        active: form.active,
      })
      .eq("id", product.id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  }

  async function handleDelete() {
    if (!product || !confirm("¿Eliminar este producto?")) return;
    const supabase = getSupabase();
    await supabase.from("products").delete().eq("id", product.id);
    router.push("/admin/productos");
    router.refresh();
  }

  if (loading) return <p className="text-tylo-teal">Cargando...</p>;
  if (!product) return <p className="text-red-600">Producto no encontrado.</p>;

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-tylo-teal mb-4 inline-block">
        ← Volver a productos
      </Link>
      <h1 className="text-xl font-bold text-tylo-text mb-6">Editar producto</h1>

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
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                category: e.target.value as "pañoletas" | "accesorios",
              }))
            }
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          >
            <option value="pañoletas">Pañoletas</option>
            <option value="accesorios">Accesorios</option>
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
            required
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Medidas
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
            Variantes
          </label>
          <input
            type="text"
            value={form.variants}
            onChange={(e) =>
              setForm((f) => ({ ...f, variants: e.target.value }))
            }
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={form.active}
            onChange={(e) =>
              setForm((f) => ({ ...f, active: e.target.checked }))
            }
            className="rounded border-tylo-teal/30"
          />
          <label htmlFor="active" className="text-sm text-tylo-text">
            Visible en el catálogo
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-3">
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
          <button
            type="button"
            onClick={handleDelete}
            className="py-2 px-4 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </form>
    </div>
  );
}
