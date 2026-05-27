import Link from "next/link";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { isClerkConfigured } from "@/lib/env/clerk";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return false;
  return url.startsWith("https://") && key.startsWith("eyJ");
}

export default function SetupPage() {
  const clerkOk = isClerkConfigured();
  const supabaseOk = isSupabaseConfigured();

  return (
    <AuroraBackground>
      <main className="mx-auto min-h-dvh max-w-[600px] px-6 py-10">
        <h1 className="font-playfair text-3xl font-semibold text-on-surface">
          Project setup
        </h1>
        <p className="mt-3 font-montserrat text-on-surface-variant">
          Auth and database configuration are required for this app to function properly.
        </p>

        <GlassCard className="mt-8 space-y-6">
          <section>
            <h2 className="font-playfair text-xl text-on-surface">Clerk (auth)</h2>
            <p className="mt-2 font-montserrat text-xs text-on-surface-variant">
              Status: {clerkOk ? "✓ configured" : "○ waiting on auth"}
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-on-surface">Supabase</h2>
            <p className="mt-2 font-montserrat text-xs text-on-surface-variant">
              Status: {supabaseOk ? "✓ configured" : "○ needed for real saves"}
            </p>
          </section>
        </GlassCard>
      </main>
    </AuroraBackground>
  );
}
