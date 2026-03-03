"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { CartBar } from "./CartBar";
import { CatalogIntro } from "./CatalogIntro";
import { IntroProvider } from "@/context/IntroContext";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [introClosed, setIntroClosed] = useState(false);

  useEffect(() => {
    if (pathname === "/") setIntroClosed(false);
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  const isCatalogHome = pathname === "/";

  return (
    <>
      <IntroProvider value={{ introClosed }}>
        <Header />
        {isCatalogHome && <CatalogIntro onClose={() => setIntroClosed(true)} />}
        {children}
      </IntroProvider>
      <CartBar />
    </>
  );
}
