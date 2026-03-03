"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-tylo-cream/95 backdrop-blur border-b border-tylo-teal/10">
      <div className="flex items-center justify-between py-1.5 px-4 max-w-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center justify-center shrink-0 rounded-full overflow-hidden w-10 h-10"
          aria-label="Tylo - Inicio"
        >
          <Image
            src="/tylo-logo.png"
            alt="Tylo"
            width={80}
            height={80}
            className="h-full w-full object-cover"
            sizes="40px"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
