import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { PillButton } from "@/components/ui/PillButton";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/onboarding/profile");
  }

  return (
    <AuroraBackground>
      <main className="mx-auto flex min-h-dvh max-w-[600px] flex-col items-center justify-center px-6 text-center animate-soft-rise">
        <p className="font-montserrat text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
          Golden-hour clarity
        </p>
        <h1 className="mt-4 font-playfair text-[40px] font-bold leading-tight tracking-tight text-on-surface">
          Saanjh
        </h1>
        <p className="mt-4 max-w-sm font-montserrat text-lg text-on-surface-variant">
          Your daily life navigator — plans that know what India does to your day.
        </p>
        <div className="mt-12 flex w-full max-w-xs flex-col gap-3">
          <Link href="/sign-up">
            <PillButton className="w-full">Get started</PillButton>
          </Link>
          <Link href="/sign-in">
            <PillButton variant="secondary" className="w-full">
              Sign in
            </PillButton>
          </Link>
        </div>
      </main>
    </AuroraBackground>
  );
}
