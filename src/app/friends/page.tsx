export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateDbUser } from "@/lib/auth";
import { FriendsPageClient } from "@/components/friends/FriendsPageClient";
import { getBangaloreWeatherContext } from "@/lib/weather";

export default async function FriendsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, clerkUser, weather] = await Promise.all([
    getOrCreateDbUser(userId),
    currentUser(),
    getBangaloreWeatherContext(),
  ]);

  return (
    <FriendsPageClient
      userName={user.display_name ?? clerkUser?.firstName ?? "there"}
      profileImageUrl={clerkUser?.imageUrl ?? null}
      weather={weather}
    />
  );
}
