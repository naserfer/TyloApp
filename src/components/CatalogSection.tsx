"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/database";

type Props = {
  title: string;
  products: Product[];
};

const STAGGER_MS = 80;

export function CatalogSection({ title, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-tylo-text uppercase tracking-wider mb-4 border-l-4 border-tylo-teal pl-3 animate-page-fade opacity-0 [animation-fill-mode:forwards]">
        {title}
      </h2>
      <ul className="grid grid-cols-2 gap-4">
        {products.map((product, index) => (
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
  );
}
