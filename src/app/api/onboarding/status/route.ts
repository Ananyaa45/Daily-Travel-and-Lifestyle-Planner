import { NextResponse } from "next/server";
import { getOnboardingStatus, getOrCreateDbUser, requireAuth } from "@/lib/auth";

export async function GET() {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateDbUser(clerkId);
    const status = getOnboardingStatus(user);

    return NextResponse.json({
      ...status,
      displayName: user.display_name,
      profilePhotoUrl: user.profile_photo_url,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
