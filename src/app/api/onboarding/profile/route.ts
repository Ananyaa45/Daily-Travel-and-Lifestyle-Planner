import { NextResponse } from "next/server";
import { getOrCreateDbUser, requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { profileSetupSchema } from "@/lib/validations/onboarding";

export async function GET() {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateDbUser(clerkId);
    return NextResponse.json({
      displayName: user.display_name,
      profilePhotoUrl: user.profile_photo_url,
      onboardingProfileComplete: user.onboarding_profile_complete,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSetupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { displayName, profilePhotoUrl, skip } = parsed.data;
    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {
      onboarding_profile_complete: true,
    };

    if (!skip) {
      if (displayName) updates.display_name = displayName;
      if (profilePhotoUrl !== undefined) {
        updates.profile_photo_url = profilePhotoUrl;
      }
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        displayName: data.display_name,
        profilePhotoUrl: data.profile_photo_url,
        onboardingProfileComplete: data.onboarding_profile_complete,
      },
      nextPath: "/onboarding/preferences",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
