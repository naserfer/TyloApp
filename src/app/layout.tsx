import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { StoreLayout } from "@/components/StoreLayout";

export const metadata: Metadata = {
  title: "Tylo — Pañoletas y accesorios",
  description: "Catálogo de pañoletas y accesorios. Comprá por WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d5c5c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col touch-manual">
        <CartProvider>
          <StoreLayout>
            <main className="flex-1 pb-24">{children}</main>
          </StoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}
