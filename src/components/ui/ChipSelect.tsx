"use client";

import { cn } from "@/lib/utils/cn";

export interface ChipOption {
  readonly id: string;
  readonly label: string;
}

export function ChipSelect({
  label,
  hint,
  options,
  selected,
  onChange,
  multi = true,
}: {
  label: string;
  hint?: string;
  options: readonly ChipOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
  multi?: boolean;
}) {
  const toggle = (id: string) => {
    if (multi) {
      onChange(
        selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id]
      );
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-montserrat text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        {hint && (
          <p className="mt-1 font-montserrat text-sm text-on-surface-variant/80">
            {hint}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={cn(
                "h-8 rounded-full px-4 font-montserrat text-sm font-medium backdrop-blur transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/40",
                isSelected
                  ? "bg-primary-container text-on-primary-container"
                  : "border border-outline-variant/40 bg-surface-container-high/70 text-on-surface-variant hover:bg-surface-container-high"
              )}
              aria-pressed={isSelected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
