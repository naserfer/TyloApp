"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const publicPaths = ["/admin", "/admin/login"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const isLoginPage = pathname === "/admin/login";
    if (!user && !isLoginPage) {
      router.replace("/admin/login");
      return;
    }
    if (user && isLoginPage) {
      router.replace("/admin/productos");
      return;
    }
  }, [user, loading, pathname, router]);

  const isLoginPage = pathname === "/admin/login";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tylo-cream">
        <p className="text-tylo-teal">Cargando...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-tylo-cream">
      <nav className="bg-white border-b border-tylo-teal/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/admin/productos" className="flex items-center gap-2 shrink-0 rounded-full overflow-hidden" aria-label="Tylo Admin - Inicio">
            <Image src="/tylo-logo.png" alt="" width={64} height={64} className="h-8 w-8 object-cover" sizes="32px" />
            <span className="font-semibold text-tylo-teal">Admin</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/admin/productos" className="text-tylo-text hover:underline">
              Productos
            </Link>
            <Link href="/admin/categorias" className="text-tylo-text hover:underline">
              Categorías
            </Link>
            <Link href="/admin/config" className="text-tylo-text hover:underline">
              Config
            </Link>
            <button
              type="button"
              onClick={async () => {
                await getSupabase().auth.signOut();
                router.replace("/admin/login");
              }}
              className="text-red-600 hover:underline"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
