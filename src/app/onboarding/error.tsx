"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[600px] flex-col items-center justify-center gap-6 bg-surface px-6">
      <h1 className="font-playfair text-2xl text-on-surface">
        Onboarding error
      </h1>
      <p className="font-montserrat text-sm text-on-surface-variant">
        {error.message}
      </p>
      <PillButton type="button" onClick={() => reset()}>
        Try again
      </PillButton>
      <Link href="/onboarding/profile" className="font-montserrat text-sm text-primary">
        Back to profile step
      </Link>
    </main>
  );
}
