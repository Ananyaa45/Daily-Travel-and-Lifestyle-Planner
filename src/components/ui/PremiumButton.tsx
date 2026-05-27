"use client";

import { cn } from "@/lib/utils/cn";

export function PremiumButton({
  children,
  disabled,
  className,
  onClick,
  type = "button",
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "btn-premium flex w-full items-center justify-center gap-2 rounded-full py-4 font-montserrat text-sm font-semibold uppercase tracking-wider",
        className
      )}
    >
      {children}
      <span className="material-symbols-outlined arrow-icon text-[18px]">
        arrow_forward
      </span>
    </button>
  );
}
