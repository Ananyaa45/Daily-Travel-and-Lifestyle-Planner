const PLACEHOLDER_MARKERS = ["...", "your-", "REPLACE"];

export function isClerkConfigured(): boolean {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const secret = process.env.CLERK_SECRET_KEY?.trim();

  if (!publishable || !secret) return false;

  const looksPlaceholder = (value: string) =>
    PLACEHOLDER_MARKERS.some((m) => value.includes(m)) || value.length < 30;

  if (looksPlaceholder(publishable) || looksPlaceholder(secret)) return false;

  return (
    publishable.startsWith("pk_test_") || publishable.startsWith("pk_live_")
  );
}
