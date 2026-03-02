"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";

const KEY_WHATSAPP = "whatsapp_number";

export default function AdminConfigPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("site_config")
      .select("value")
      .eq("key", KEY_WHATSAPP)
      .maybeSingle()
      .then(({ data }) => {
        setWhatsapp(data?.value ?? "");
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const value = whatsapp.replace(/\D/g, "").trim();
    const supabase = getSupabase();
    const { error } = await supabase.from("site_config").upsert(
      { key: KEY_WHATSAPP, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    setSaving(false);
    if (error) {
      setMessage("Error: " + error.message);
      return;
    }
    setMessage("Guardado. El botón de WhatsApp en el carrito usará este número.");
  }

  if (loading) return <p className="text-tylo-teal">Cargando...</p>;

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-tylo-teal mb-4 inline-block">
        ← Volver
      </Link>
      <h1 className="text-xl font-bold text-tylo-text mb-6">Configuración</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Número de WhatsApp
          </label>
          <p className="text-xs text-tylo-teal/70 mb-1">
            Código de país + número, sin + ni espacios (ej: 595981123456)
          </p>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="595981123456"
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        {message && (
          <p className="text-sm text-tylo-teal">{message}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="py-2 px-4 rounded-lg bg-tylo-teal text-white font-medium disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
