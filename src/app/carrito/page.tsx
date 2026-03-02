"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

function formatWhatsAppMessage(
  items: { product: { name: string; price_guaranies: number }; quantity: number }[],
  total: number
): string {
  const lines = [
    "¡Hola! Quiero hacer un pedido:",
    "",
    ...items.map(
      (i) =>
        `• ${i.product.name} x${i.quantity} — Gs. ${(i.product.price_guaranies * i.quantity).toLocaleString("es-PY")}`
    ),
    "",
    `Total: Gs. ${total.toLocaleString("es-PY")}`,
  ];
  return lines.join("\n");
}

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalItems, totalGuaranies } =
    useCart();
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const envNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    if (envNum) {
      setWhatsappNumber(envNum);
      return;
    }
    getSupabase()
      .from("site_config")
      .select("value")
      .eq("key", "whatsapp_number")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setWhatsappNumber(data.value);
      });
  }, []);

  const message = useMemo(
    () => formatWhatsAppMessage(items, totalGuaranies),
    [items, totalGuaranies]
  );
  const waUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : null;

  if (totalItems === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-tylo-teal/80 mb-4">Tu carrito está vacío.</p>
        <Link
          href="/"
          className="inline-block py-2 px-4 rounded-lg bg-tylo-teal text-white font-medium"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-tylo-text mb-6">Tu carrito</h1>

      <ul className="space-y-4">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex gap-3 bg-white rounded-xl border border-tylo-teal/10 p-3"
          >
            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-tylo-cream shrink-0">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-tylo-teal/30 text-lg">
                  TYLO
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-tylo-text text-sm uppercase">
                {product.name}
              </p>
              <p className="text-xs text-tylo-teal">
                Gs. {product.price_guaranies.toLocaleString("es-PY")} c/u
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-tylo-teal/30 text-tylo-teal text-sm font-medium"
                >
                  −
                </button>
                <span className="text-sm font-medium w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-tylo-teal/30 text-tylo-teal text-sm font-medium"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="ml-2 text-xs text-red-600"
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-white rounded-xl border border-tylo-teal/10">
        <p className="text-sm text-tylo-teal/80 mb-1">
          Al tocar el botón se abre WhatsApp con tu pedido listo para enviar.
        </p>
        <p className="font-semibold text-tylo-text">
          Total: Gs. {totalGuaranies.toLocaleString("es-PY")}
        </p>
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-[#25D366] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <span>Enviar pedido por WhatsApp</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        ) : (
          <p className="mt-4 text-sm text-tylo-teal/70">
            Configurá NEXT_PUBLIC_WHATSAPP_NUMBER para habilitar el botón.
          </p>
        )}
      </div>
    </div>
  );
}
