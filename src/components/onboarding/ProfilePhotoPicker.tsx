"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ProfilePhotoPicker({
  value,
  onChange,
  onUploadingChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/onboarding/profile-photo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const isBlob = value?.startsWith("blob:");

  return (
    <div className="flex w-full flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative cursor-pointer"
        aria-label="Add a profile photo"
      >
        <div
          className={cn(
            "upload-circle relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 shadow-sm transition-all duration-700",
            uploading && "opacity-60"
          )}
        >
          {value ? (
            isBlob ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Image
                src={value}
                alt="Profile"
                fill
                className="rounded-full object-cover"
                sizes="112px"
              />
            )
          ) : (
            <span
              className="material-symbols-outlined text-[32px] font-thin text-on-surface-variant/30"
              style={{ fontVariationSettings: "'wght' 200" }}
            >
              add_a_photo
            </span>
          )}
        </div>
        <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-white/80 text-primary shadow-sm backdrop-blur-sm">
          <span className="material-symbols-outlined text-[16px] font-bold">add</span>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <p className="mt-4 font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant/70">
        Add a profile photo
      </p>

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-2 font-montserrat text-xs text-primary/80 hover:text-primary"
        >
          Remove photo
        </button>
      )}

      {error && (
        <p className="mt-2 font-montserrat text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
