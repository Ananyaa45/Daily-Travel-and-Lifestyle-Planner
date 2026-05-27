"use client";

import { cn } from "@/lib/utils/cn";

export function GlassInput({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label className="font-montserrat text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-[52px] w-full rounded-full border border-outline-variant/50 bg-white/25 px-5 font-montserrat text-base text-on-surface backdrop-blur-sm placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15",
          error && "border-error focus:border-error focus:ring-error/15",
          className
        )}
        {...props}
      />
      {error && (
        <p className="px-2 font-montserrat text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
