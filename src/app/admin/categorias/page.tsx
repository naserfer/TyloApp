"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import type { Category } from "@/types/database";

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", sort_order: 0 });
  const [showNew, setShowNew] = useState(false);

  function load() {
    const supabase = getSupabase();
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setCategories((data as Category[]) ?? []);
        setLoading(false);
      });
  }

  useEffect(() => load(), []);

  async function handleSubmitNew(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const supabase = getSupabase();
    const slug = form.slug.trim() || slugFromName(form.name.trim());
    const { error: err } = await supabase.from("categories").insert({
      name: form.name.trim(),
      slug,
      sort_order: form.sort_order,
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setForm({ name: "", slug: "", sort_order: categories.length });
    setShowNew(false);
    load();
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const supabase = getSupabase();
    const { error: err } = await supabase
      .from("categories")
      .update({
        name: form.name.trim(),
        slug: form.slug.trim(),
        sort_order: form.sort_order,
      })
      .eq("id", id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos que la usen quedarán sin categoría asignada.`)) return;
    setError("");
    const supabase = getSupabase();
    const { error: err } = await supabase.from("categories").delete().eq("id", id);
    if (err) setError(err.message);
    else load();
  }

  if (loading) return <p className="text-tylo-teal">Cargando...</p>;

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-tylo-teal mb-4 inline-block">
        ← Volver
      </Link>
      <h1 className="text-xl font-bold text-tylo-text mb-6">Categorías</h1>
      <p className="text-sm text-tylo-teal/80 mb-6">
        Las categorías aparecen como pestañas en el catálogo. El slug se usa internamente (ej: pañoletas, accesorios).
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <ul className="space-y-3 mb-8">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between gap-4 py-3 px-4 bg-white rounded-xl border border-tylo-teal/10"
          >
            {editingId === cat.id ? (
              <form
                onSubmit={(e) => handleUpdate(e, cat.id)}
                className="flex flex-wrap items-center gap-3 flex-1"
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre"
                  className="px-3 py-2 rounded-lg border border-tylo-teal/20 w-32"
                  required
                />
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="slug"
                  className="px-3 py-2 rounded-lg border border-tylo-teal/20 w-28 text-sm"
                />
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
                  className="px-3 py-2 rounded-lg border border-tylo-teal/20 w-16"
                />
                <button type="submit" disabled={saving} className="py-2 px-3 rounded-lg bg-tylo-teal text-white text-sm">
                  Guardar
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-sm text-tylo-teal/80">
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <span className="font-medium text-tylo-text">{cat.name}</span>
                <span className="text-sm text-tylo-teal/70">{cat.slug}</span>
                <span className="text-xs text-tylo-teal/50">orden: {cat.sort_order}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(cat.id);
                      setForm({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order });
                    }}
                    className="text-sm text-tylo-teal hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {showNew ? (
        <form onSubmit={handleSubmitNew} className="p-4 bg-white rounded-xl border border-tylo-teal/10 space-y-3 max-w-md">
          <h2 className="font-semibold text-tylo-text">Nueva categoría</h2>
          <div>
            <label className="block text-sm text-tylo-teal/80 mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugFromName(e.target.value) }))}
              placeholder="ej. Accesorios"
              className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-tylo-teal/80 mb-1">Slug (opcional, se genera del nombre)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="ej. accesorios"
              className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20"
            />
          </div>
          <div>
            <label className="block text-sm text-tylo-teal/80 mb-1">Orden</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
              className="w-24 px-3 py-2 rounded-lg border border-tylo-teal/20"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="py-2 px-4 rounded-lg bg-tylo-teal text-white font-medium">
              {saving ? "Guardando..." : "Crear"}
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="py-2 px-4 rounded-lg border border-tylo-teal/30 text-tylo-text">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setShowNew(true);
            setForm({ name: "", slug: "", sort_order: categories.length });
          }}
          className="py-2 px-4 rounded-lg bg-tylo-teal text-white font-medium"
        >
          + Agregar categoría
        </button>
      )}
    </div>
  );
}
