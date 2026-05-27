import { cn } from "@/lib/utils/cn";

export function GlassCard({
  children,
  className,
  as: Component = "article",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "section" | "div";
}) {
  return (
    <Component
      className={cn(
        "rounded-3xl border border-white/35 border-t-white/60 bg-white/45 p-6 shadow-glow backdrop-blur-2xl",
        className
      )}
    >
      {children}
    </Component>
  );
}
