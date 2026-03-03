"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const DURATION_MS = 3500;

type Props = {
  onClose?: () => void;
};

export function CatalogIntro({ onClose }: Props) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  function close() {
    if (!visible || exiting) return;
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 400);
  }

  useEffect(() => {
    if (!visible || exiting) return;
    const t = setTimeout(close, DURATION_MS);
    return () => clearTimeout(t);
  }, [visible, exiting]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={close}
      className="fixed inset-0 z-50 w-full h-full min-h-[100dvh] min-w-[100vw] bg-black focus:outline-none focus:ring-2 focus:ring-tylo-teal/30"
      style={{ height: "100dvh" }}
      aria-label="Cerrar y ver catálogo"
    >
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center animate-catalog-intro ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
        style={{
          height: "100dvh",
          willChange: "transform, opacity",
          transform: "translateZ(0)",
          transition: exiting ? "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
      >
        <Image
          src="/catalog-intro.png"
          alt="Tylo — Pañoletas y accesorios"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          unoptimized
        />
      </div>
      <p className="absolute bottom-8 left-4 right-4 text-center text-lg font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.6)] px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm max-w-fit mx-auto">
        Tocá para entrar al catálogo
      </p>
    </button>
  );
}
