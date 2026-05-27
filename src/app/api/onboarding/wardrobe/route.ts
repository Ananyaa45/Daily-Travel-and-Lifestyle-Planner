import { NextResponse } from "next/server";
import { getOrCreateDbUser, requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { wardrobeCompleteSchema } from "@/lib/validations/onboarding";
import { toWardrobeItemDTO, type WardrobeItem } from "@/lib/types/wardrobe";

export async function GET() {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("wardrobe_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      items: (data as WardrobeItem[]).map(toWardrobeItemDTO),
      onboardingWardrobeComplete: user.onboarding_wardrobe_complete,
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
    const parsed = wardrobeCompleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("users")
      .update({ onboarding_wardrobe_complete: true })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      onboardingWardrobeComplete: true,
      nextPath: "/home",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
