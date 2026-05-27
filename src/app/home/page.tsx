export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOnboardingStatus, getOrCreateDbUser } from "@/lib/auth";
import { UserMenu } from "@/components/auth/UserMenu";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateDbUser(userId);
  const status = getOnboardingStatus(user);

  return (
    <AuroraBackground>
      <main className="mx-auto min-h-dvh max-w-[600px] px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-montserrat text-sm text-on-surface-variant">
              Good morning
            </p>
            <h1 className="font-playfair text-2xl font-semibold text-on-surface">
              {user.display_name ?? "there"}
            </h1>
          </div>
          <UserMenu />
        </header>

        <GlassCard>
          <p className="font-montserrat text-on-surface-variant">
            Home tab — plan generation comes next. Your onboarding status:
          </p>
          <ul className="mt-4 space-y-2 font-montserrat text-sm">
            <li>Profile: {status.profile ? "✓" : "pending"}</li>
            <li>Preferences: {status.preferences ? "✓" : "pending"}</li>
            <li>Calendar: {status.calendar ? "✓" : "pending"}</li>
            <li>Wardrobe: {status.wardrobe ? "✓" : "pending"}</li>
          </ul>
        </GlassCard>
      </main>
    </AuroraBackground>
  );
}
