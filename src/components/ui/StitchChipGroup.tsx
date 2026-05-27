"use client";

import { cn } from "@/lib/utils/cn";
import type { ChipOption } from "@/components/ui/ChipSelect";

export function StitchChipGroup({
  icon,
  label,
  options,
  selected,
  onChange,
}: {
  icon: string;
  label: string;
  options: readonly ChipOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          {icon}
        </span>
        <h2 className="font-montserrat text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
          {label}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={cn(
                "rounded-full px-4 py-2 font-montserrat text-base transition-all duration-300",
                active ? "pill-active" : "pill-inactive text-on-surface-variant"
              )}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
