"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartBar() {
  const { totalItems, totalGuaranies, clearCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-tylo-teal/10 shadow-[0_-4px_20px_rgba(13,92,92,0.08)]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-tylo-text">
            {totalItems} {totalItems === 1 ? "producto" : "productos"}
          </p>
          <p className="text-sm text-tylo-teal font-semibold">
            Gs. {totalGuaranies.toLocaleString("es-PY")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCart}
            className="py-3 px-3 rounded-lg border border-tylo-teal/30 text-tylo-teal text-sm font-medium hover:bg-tylo-teal/5 active:bg-tylo-teal/10 transition-colors"
            aria-label="Vaciar carrito"
          >
            Vaciar
          </button>
          <Link
            href="/carrito"
            className="flex-1 min-w-0 max-w-[180px] py-3 px-4 rounded-lg bg-tylo-teal text-white text-center font-medium text-sm shadow-sm hover:bg-tylo-teal-dark transition-colors"
          >
            Ver carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
