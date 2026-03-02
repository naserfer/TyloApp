"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/productos");
  }, [router]);
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-tylo-teal">Redirigiendo...</p>
    </div>
  );
}
