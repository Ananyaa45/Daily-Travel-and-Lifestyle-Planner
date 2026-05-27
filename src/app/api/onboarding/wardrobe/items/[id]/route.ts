import { NextResponse } from "next/server";
import { getOrCreateDbUser, requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { wardrobeItemUpdateSchema } from "@/lib/validations/onboarding";
import { toWardrobeItemDTO, type WardrobeItem } from "@/lib/types/wardrobe";

const BUCKET = "wardrobe-photos";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = wardrobeItemUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    // Snake_case rename so we only build columns the user actually sent.
    const updates: Record<string, unknown> = {};
    if (parsed.data.category !== undefined) updates.category = parsed.data.category;
    if (parsed.data.colors !== undefined) updates.colors = parsed.data.colors;
    if (parsed.data.occasions !== undefined) updates.occasions = parsed.data.occasions;
    if (parsed.data.seasons !== undefined) updates.seasons = parsed.data.seasons;
    if (parsed.data.isFavorite !== undefined)
      updates.is_favorite = parsed.data.isFavorite;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("wardrobe_items")
      .update(updates)
      .eq("id", params.id)
      .eq("user_id", user.id) // ownership guard
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      item: toWardrobeItemDTO(data as WardrobeItem),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    // Fetch first so we know the photo_path before deletion (owner-checked).
    const { data: item, error: fetchError } = await supabase
      .from("wardrobe_items")
      .select("id, photo_path")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from("wardrobe_items")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Best-effort photo cleanup; swallow errors so a stuck storage object
    // doesn't make the row deletion look like it failed.
    await supabase.storage.from(BUCKET).remove([item.photo_path]);

    return NextResponse.json({ deleted: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
