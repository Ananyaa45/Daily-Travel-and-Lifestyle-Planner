import { SignUp } from "@clerk/nextjs";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function SignUpPage() {
  return (
    <AuroraBackground>
      <main className="mx-auto flex min-h-dvh max-w-[600px] items-center justify-center px-6 py-10">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/onboarding/profile"
        />
      </main>
    </AuroraBackground>
  );
}
