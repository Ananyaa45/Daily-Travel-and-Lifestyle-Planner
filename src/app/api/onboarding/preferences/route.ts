import { NextResponse } from "next/server";
import { getOrCreateDbUser, requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { preferencesSchema } from "@/lib/validations/onboarding";

export async function GET() {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateDbUser(clerkId);
    return NextResponse.json({
      dietaryTags: user.dietary_tags,
      lifestyleTags: user.lifestyle_tags,
      interestTags: user.interest_tags,
      onboardingPreferencesComplete: user.onboarding_preferences_complete,
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
    const parsed = preferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      dietaryTags,
      lifestyleTags,
      interestTags,
      skip,
    } = parsed.data;

    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {
      onboarding_preferences_complete: true,
    };

    if (!skip) {
      updates.dietary_tags = dietaryTags;
      updates.lifestyle_tags = lifestyleTags;
      updates.interest_tags = interestTags;
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
        dietaryTags: data.dietary_tags,
        lifestyleTags: data.lifestyle_tags,
        interestTags: data.interest_tags,
        onboardingPreferencesComplete: data.onboarding_preferences_complete,
      },
      nextPath: "/onboarding/calendar",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
