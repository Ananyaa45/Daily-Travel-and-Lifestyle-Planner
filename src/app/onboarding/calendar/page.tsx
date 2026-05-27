"use client";

import Link from "next/link";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";

export default function CalendarOnboardingPlaceholder() {
  return (
    <AuroraBackground>
      <main className="mx-auto flex min-h-dvh max-w-[600px] flex-col justify-center gap-8 px-6 py-10">
        <GlassCard>
          <h1 className="font-playfair text-2xl font-semibold text-on-surface">
            Calendar sync
          </h1>
          <p className="mt-3 font-montserrat text-on-surface-variant">
            Your profile and preferences are saved. A teammate wires Google Calendar here next.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/home">
              <PillButton className="w-full">Go to Home</PillButton>
            </Link>
          </div>
        </GlassCard>
      </main>
    </AuroraBackground>
  );
}
