"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-tylo-cream/95 backdrop-blur border-b border-tylo-teal/10">
      <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Tylo - Inicio"
        >
          <Image
            src="/tylo-logo.png"
            alt="Tylo"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
            priority
            unoptimized
          />
        </Link>
      </div>
    </header>
  );
}
