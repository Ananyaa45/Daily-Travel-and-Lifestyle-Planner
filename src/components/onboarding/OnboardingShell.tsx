"use client";

import { AuroraBackground } from "@/components/ui/AuroraBackground";

export function OnboardingShell({
  step,
  totalSteps = 4,
  title,
  subtitle,
  children,
  footer,
}: {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const progress = (step / totalSteps) * 100;

  return (
    <AuroraBackground>
      <main className="mx-auto flex min-h-dvh max-w-[600px] flex-col px-6 pb-8 pt-10 animate-soft-rise">
        <header className="mb-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="font-playfair text-xl font-semibold text-primary">
              Saanjh
            </span>
            <span className="font-montserrat text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div
            className="h-1 overflow-hidden rounded-full bg-surface-container-high"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div>
            <h1 className="font-playfair text-[28px] font-semibold leading-tight tracking-tight text-on-surface sm:text-[32px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 font-montserrat text-lg leading-relaxed text-on-surface-variant">
                {subtitle}
              </p>
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-10">{children}</div>

        <footer className="mt-10 flex flex-col gap-3">{footer}</footer>
      </main>
    </AuroraBackground>
  );
}
