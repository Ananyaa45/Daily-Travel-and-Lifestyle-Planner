"use client";

import { useRef, useState } from "react";
import { WardrobeItemCard } from "@/components/onboarding/WardrobeItemCard";
import type { WardrobeItemDTO } from "@/lib/types/wardrobe";
import { cn } from "@/lib/utils/cn";

const MAX_ITEMS = 12;

export function WardrobeUploader({
  items,
  onItemsChange,
  onUploadingChange,
}: {
  items: WardrobeItemDTO[];
  onItemsChange: (items: WardrobeItemDTO[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const atCap = items.length >= MAX_ITEMS;

  function setBusy(busy: boolean) {
    setUploading(busy);
    onUploadingChange?.(busy);
  }

  function markPending(id: string, pending: boolean) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }
    if (atCap) {
      setError(`You can add up to ${MAX_ITEMS} pieces during onboarding.`);
      return;
    }

    setBusy(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/onboarding/wardrobe/items", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Upload failed"
        );
      }

      onItemsChange([data.item, ...items]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleFavorite(item: WardrobeItemDTO) {
    setError(null);
    markPending(item.id, true);

    // Optimistic update — flip locally first so the heart fills instantly.
    const optimistic = items.map((i) =>
      i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i
    );
    onItemsChange(optimistic);

    try {
      const res = await fetch(`/api/onboarding/wardrobe/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !item.isFavorite }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update");

      // Sync with server response in case of clock skew on isFavorite, etc.
      onItemsChange(
        optimistic.map((i) => (i.id === item.id ? data.item : i))
      );
    } catch (e) {
      // Roll back optimistic update
      onItemsChange(items);
      setError(e instanceof Error ? e.message : "Could not update");
    } finally {
      markPending(item.id, false);
    }
  }

  async function deleteItem(item: WardrobeItemDTO) {
    setError(null);
    markPending(item.id, true);

    try {
      const res = await fetch(`/api/onboarding/wardrobe/items/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not remove");

      onItemsChange(items.filter((i) => i.id !== item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove");
    } finally {
      markPending(item.id, false);
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Upload tile — always first, becomes disabled at cap */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || atCap}
          className={cn(
            "upload-circle relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl text-on-surface-variant transition-all",
            uploading && "overflow-hidden"
          )}
          aria-label="Add a clothing photo"
        >
          {uploading ? (
            <>
              <div className="ai-shimmer pointer-events-none absolute inset-0" aria-hidden />
              <span
                className="material-symbols-outlined animate-pulse text-[28px] text-tertiary"
                style={{ fontVariationSettings: "'wght' 300" }}
              >
                auto_awesome
              </span>
              <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-tertiary">
                Tagging…
              </span>
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined text-[28px] text-primary/60"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                add_a_photo
              </span>
              <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/80">
                {atCap ? "Limit reached" : items.length === 0 ? "Add first piece" : "Add another"}
              </span>
            </>
          )}
        </button>

        {items.map((item) => (
          <WardrobeItemCard
            key={item.id}
            item={item}
            pending={pendingIds.has(item.id)}
            onToggleFavorite={() => void toggleFavorite(item)}
            onDelete={() => void deleteItem(item)}
          />
        ))}
      </div>

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

      {error && (
        <p
          className="text-center font-montserrat text-xs text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <p className="text-center font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant/60">
        {items.length === 0
          ? "We'll tag each piece for you"
          : `${items.length} of ${MAX_ITEMS} curated`}
      </p>
    </div>
  );
}
