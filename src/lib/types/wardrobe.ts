export interface WardrobeItem {
  id: string;
  user_id: string;
  photo_url: string;
  photo_path: string;
  category: string | null;
  colors: string[];
  occasions: string[];
  seasons: string[];
  is_favorite: boolean;
  ai_tagged: boolean;
  created_at: string;
  updated_at: string;
}

// Shape returned by /api/onboarding/wardrobe and /items routes — camelCase for the client.
export interface WardrobeItemDTO {
  id: string;
  photoUrl: string;
  category: string | null;
  colors: string[];
  occasions: string[];
  seasons: string[];
  isFavorite: boolean;
  aiTagged: boolean;
}

export function toWardrobeItemDTO(row: WardrobeItem): WardrobeItemDTO {
  return {
    id: row.id,
    photoUrl: row.photo_url,
    category: row.category,
    colors: row.colors,
    occasions: row.occasions,
    seasons: row.seasons,
    isFavorite: row.is_favorite,
    aiTagged: row.ai_tagged,
  };
}
