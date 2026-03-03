"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = getSupabase();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/admin/productos");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-tylo-cream via-white to-tylo-cream/50">
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-tylo-teal/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-tylo-teal/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-tylo-teal/[0.02] blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px] animate-page-fade opacity-0 [animation-fill-mode:forwards]">
        {/* Card */}
        <div className="rounded-2xl border border-tylo-teal/10 bg-white/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(13,92,92,0.08)] overflow-hidden">
          {/* Header strip */}
          <div className="h-1.5 bg-gradient-to-r from-tylo-teal via-tylo-teal-light to-tylo-teal" />

          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-6">
              <div className="rounded-full overflow-hidden">
                <Image
                  src="/tylo-logo.png"
                  alt="Tylo"
                  width={112}
                  height={112}
                  className="h-14 w-14 object-cover"
                  sizes="56px"
                  priority
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-tylo-text text-center tracking-tight">
              Panel de administración
            </h1>
            <p className="text-sm text-tylo-teal/70 text-center mt-1.5 mb-8">
              Iniciá sesión para gestionar productos y pedidos
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-tylo-text mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-tylo-teal/20 bg-white text-tylo-text placeholder:text-tylo-teal/40 focus:outline-none focus:ring-2 focus:ring-tylo-teal/30 focus:border-tylo-teal/40 transition-shadow duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-tylo-text mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-tylo-teal/20 bg-white text-tylo-text placeholder:text-tylo-teal/40 focus:outline-none focus:ring-2 focus:ring-tylo-teal/30 focus:border-tylo-teal/40 transition-shadow duration-200"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-tylo-teal text-white font-medium shadow-[0_4px_14px_rgba(13,92,92,0.25)] hover:bg-tylo-teal-dark hover:shadow-[0_6px_20px_rgba(13,92,92,0.3)] focus:outline-none focus:ring-2 focus:ring-tylo-teal focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99]"
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-tylo-teal/70 hover:text-tylo-teal transition-colors"
          >
            ← Volver al catálogo
          </Link>
        </p>
      </div>
    </div>
  );
}
