"use client";

import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

export function PillButton({
  children,
  variant = "primary",
  className,
  disabled,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    primary:
      "bg-primary text-on-primary shadow-glow hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    secondary:
      "border border-white/40 bg-white/30 text-on-surface backdrop-blur hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-primary/40",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/40",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex h-[52px] min-w-[120px] items-center justify-center rounded-full px-8 font-montserrat text-sm font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
