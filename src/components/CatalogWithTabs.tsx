"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/database";
import type { Category } from "@/types/database";

const STAGGER_MS = 80;

type Props = {
  categories: Category[];
  products: Product[];
};

export function CatalogWithTabs({ categories, products }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filtered =
    selectedSlug === null
      ? products
      : products.filter((p) => p.category === selectedSlug);

  const selectedName =
    selectedSlug === null
      ? "Todos"
      : categories.find((c) => c.slug === selectedSlug)?.name ?? "Todos";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-center text-tylo-teal/90 text-sm mb-6 animate-page-fade opacity-0 [animation-fill-mode:forwards]">
        Elegí lo que te guste y enviá tu pedido directo por WhatsApp.
      </p>

      <nav
        className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide animate-page-fade opacity-0 [animation-fill-mode:forwards]"
        style={{ animationDelay: "100ms" }}
        aria-label="Categorías"
      >
        <button
          type="button"
          onClick={() => setSelectedSlug(null)}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 touch-manual ${
            selectedSlug === null
              ? "bg-tylo-teal text-white shadow-tylo-glow"
              : "bg-white text-tylo-text border border-tylo-teal/20 hover:border-tylo-teal/40"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedSlug(cat.slug)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 touch-manual ${
              selectedSlug === cat.slug
                ? "bg-tylo-teal text-white shadow-tylo-glow"
                : "bg-white text-tylo-text border border-tylo-teal/20 hover:border-tylo-teal/40"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {filtered.length > 0 ? (
        <section key={selectedSlug ?? "all"} className="mb-10">
          <h2 className="text-lg font-bold text-tylo-text uppercase tracking-wider mb-4 border-l-4 border-tylo-teal pl-3 opacity-0 animate-page-fade [animation-fill-mode:forwards]">
            {selectedName}
          </h2>
          <ul className="grid grid-cols-2 gap-4">
            {filtered.map((product, index) => (
              <li
                key={product.id}
                className="animate-product-enter opacity-0 [animation-fill-mode:forwards]"
                style={{ animationDelay: `${index * STAGGER_MS}ms` }}
              >
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-center text-tylo-teal/70 py-12 animate-page-fade opacity-0 [animation-fill-mode:forwards]">
          {selectedSlug === null
            ? "Pronto vas a ver los productos acá."
            : "No hay productos en esta categoría."}
        </p>
      )}
    </div>
  );
}
