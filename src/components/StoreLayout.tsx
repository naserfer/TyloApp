"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { CartBar } from "./CartBar";
import { CatalogIntro } from "./CatalogIntro";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {pathname === "/" && <CatalogIntro />}
      {children}
      <CartBar />
    </>
  );
}
