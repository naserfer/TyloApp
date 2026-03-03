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

  // Cambiar contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "La nueva contraseña y la confirmación no coinciden." });
      return;
    }
    setPasswordSaving(true);
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setPasswordMessage({ type: "error", text: "No se pudo obtener tu usuario." });
      setPasswordSaving(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      setPasswordMessage({ type: "error", text: "Contraseña actual incorrecta." });
      setPasswordSaving(false);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);
    if (updateError) {
      setPasswordMessage({ type: "error", text: updateError.message });
      return;
    }
    setPasswordMessage({ type: "success", text: "Contraseña actualizada correctamente." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

      <hr className="my-8 border-tylo-teal/15" />

      <h2 className="text-lg font-semibold text-tylo-text mb-4">Cambiar contraseña</h2>
      <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Contraseña actual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tylo-text mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white"
          />
        </div>
        {passwordMessage && (
          <p
            className={`text-sm ${
              passwordMessage.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {passwordMessage.text}
          </p>
        )}
        <button
          type="submit"
          disabled={passwordSaving}
          className="py-2 px-4 rounded-lg bg-tylo-teal text-white font-medium disabled:opacity-60"
        >
          {passwordSaving ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
