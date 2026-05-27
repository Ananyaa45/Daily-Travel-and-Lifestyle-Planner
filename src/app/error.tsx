"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";

export default function Error({
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
    <main className="mx-auto flex min-h-dvh max-w-[600px] flex-col items-center justify-center gap-6 bg-surface px-6 font-montserrat text-on-surface">
      <h1 className="font-playfair text-2xl font-semibold">Something went wrong</h1>
      <p className="text-center text-sm text-on-surface-variant">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex flex-col gap-3">
        <PillButton type="button" onClick={() => reset()}>
          Try again
        </PillButton>
        <Link href="/onboarding/profile">
          <PillButton variant="secondary" className="w-full">
            Profile onboarding
          </PillButton>
        </Link>
      </div>
    </main>
  );
}
