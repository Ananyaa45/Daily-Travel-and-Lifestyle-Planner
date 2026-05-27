import { NextResponse } from "next/server";
import { getOrCreateDbUser, requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { tagWardrobeImage } from "@/lib/ai/vision";
import { toWardrobeItemDTO, type WardrobeItem } from "@/lib/types/wardrobe";

const BUCKET = "wardrobe-photos";
const MAX_BYTES = 5 * 1024 * 1024;
// Soft cap to keep onboarding focused — user can always add more on the profile page later.
const MAX_ITEMS = 12;

export async function POST(request: Request) {
  const clerkId = await requireAuth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getOrCreateDbUser(clerkId);
    const supabase = createAdminClient();

    // Soft cap: stop accepting new items once the user has hit MAX_ITEMS.
    const { count } = await supabase
      .from("wardrobe_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count >= MAX_ITEMS) {
      return NextResponse.json(
        { error: `You can add up to ${MAX_ITEMS} pieces during onboarding.` },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 5 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;

    // 1. Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    // 2. AI-tag (returns empty tags + aiTagged:false if Groq fails or is unconfigured)
    const tags = await tagWardrobeImage(buffer, file.type);

    // 3. Insert row
    const { data: inserted, error: insertError } = await supabase
      .from("wardrobe_items")
      .insert({
        user_id: user.id,
        photo_url: publicUrl,
        photo_path: path,
        category: tags.category,
        colors: tags.colors,
        occasions: tags.occasions,
        seasons: tags.seasons,
        ai_tagged: tags.aiTagged,
      })
      .select("*")
      .single();

    if (insertError || !inserted) {
      // Best-effort cleanup of orphaned storage object so we don't leak files.
      await supabase.storage.from(BUCKET).remove([path]);
      return NextResponse.json(
        { error: insertError?.message ?? "Failed to save item" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      item: toWardrobeItemDTO(inserted as WardrobeItem),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
