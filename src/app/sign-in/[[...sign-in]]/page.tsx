import { SignIn } from "@clerk/nextjs";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function SignInPage() {
  return (
    <AuroraBackground>
      <main className="mx-auto flex min-h-dvh max-w-[600px] items-center justify-center px-6 py-10">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/onboarding/profile"
        />
      </main>
    </AuroraBackground>
  );
}
