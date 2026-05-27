import { cn } from "@/lib/utils/cn";

export function StitchGlassPanel({
  children,
  className,
  shimmer = false,
}: {
  children: React.ReactNode;
  className?: string;
  shimmer?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-panel silk-border relative w-full overflow-hidden rounded-xl p-6 md:p-8",
        className
      )}
    >
      {shimmer && (
        <div className="ai-shimmer pointer-events-none absolute inset-0" aria-hidden />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
