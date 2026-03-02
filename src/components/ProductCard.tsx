"use client";

import Image from "next/image";
import type { Product } from "@/types/database";
import { useCart } from "@/context/CartContext";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <article className="group bg-white rounded-2xl border border-tylo-teal/10 overflow-hidden shadow-sm hover:shadow-tylo-glow hover:border-tylo-teal/20 transition-all duration-500 ease-out hover:-translate-y-0.5 touch-manual">
      <div className="aspect-square relative bg-tylo-cream overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 480px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-tylo-teal/40 text-4xl font-serif">
            TYLO
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden />
      </div>
      <div className="p-3">
        <h2 className="font-semibold text-tylo-text uppercase tracking-wide text-sm">
          {product.name}
        </h2>
        {product.dimensions && (
          <p className="text-xs text-tylo-teal/80 italic mt-0.5">
            {product.dimensions}
          </p>
        )}
        <p className="text-sm font-semibold text-tylo-teal mt-1">
          Gs. {product.price_guaranies.toLocaleString("es-PY")}
        </p>
        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-2 w-full py-2.5 px-3 rounded-xl bg-tylo-teal text-white text-sm font-medium hover:bg-tylo-teal-dark transition-all duration-300 ease-out hover:shadow-tylo-glow touch-manual"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
