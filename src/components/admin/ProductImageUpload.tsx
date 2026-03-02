"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase/client";

const BUCKET = "product-images";

type Props = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  /** Se llama cuando empieza o termina la subida (para deshabilitar Guardar hasta que termine) */
  onUploadingChange?: (uploading: boolean) => void;
};

export function ProductImageUpload({ value, onChange, disabled, onUploadingChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";
    setUploadError("");
    setUploading(true);
    onUploadingChange?.(true);
    const supabase = getSupabase();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    onUploadingChange?.(false);
    if (error) {
      setUploadError(error.message);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-tylo-text">
        Imagen del producto
      </label>

      {value ? (
        <div className="relative inline-block">
          <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-tylo-teal/20 bg-tylo-bg">
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          {!disabled && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="text-sm py-2 px-3 rounded-lg bg-tylo-teal/10 text-tylo-teal font-medium touch-manual"
              >
                {uploading ? "Subiendo…" : "Cambiar foto"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-sm py-2 px-3 rounded-lg border border-tylo-teal/30 text-tylo-text"
              >
                Quitar
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full min-h-[120px] py-6 px-4 rounded-xl border-2 border-dashed border-tylo-teal/30 bg-tylo-teal/5 text-tylo-teal font-medium flex flex-col items-center justify-center gap-2 touch-manual active:bg-tylo-teal/10"
          >
            {uploading ? (
              "Subiendo…"
            ) : (
              <>
                <span className="text-2xl" aria-hidden>📷</span>
                <span>Elegir foto</span>
                <span className="text-xs text-tylo-text/70 font-normal">
                  Desde la galería o la cámara
                </span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput((s) => !s)}
            className="text-sm text-tylo-teal underline"
          >
            {showUrlInput ? "Ocultar" : "O pegá una URL"}
          </button>
          {showUrlInput && (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-tylo-teal/20 bg-white text-sm"
            />
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}
    </div>
  );
}
