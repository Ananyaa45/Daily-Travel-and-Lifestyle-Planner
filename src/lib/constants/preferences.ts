export const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten_free", label: "Gluten-Free" },
  { id: "halal", label: "Halal" },
  { id: "jain", label: "Jain" },
  { id: "keto", label: "Keto" },
  { id: "no_restrictions", label: "Everything" }, 
] as const;

export const LIFESTYLE_OPTIONS = [
  { id: "active", label: "Active" },
  { id: "relaxed", label: "Relaxed" },
  { id: "social", label: "Social" },
  { id: "focused", label: "Focused" },
  { id: "adventurous", label: "Adventurous" },
  { id: "minimalist", label: "Minimalist" },
] as const;

export const INTEREST_OPTIONS = [
  { id: "art", label: "Art" },
  { id: "parks", label: "Parks" },
  { id: "fashion", label: "Fashion" },
  { id: "cafe_hopping", label: "Café hopping" },
  { id: "museum", label: "Museums" },
  { id: "walks", label: "Walks" },
  { id: "workout", label: "Workout" },
  { id: "night_out", label: "Night out" },
  { id: "photography", label: "Photography" },
  { id: "music", label: "Music" },
] as const;


export type DietaryId = (typeof DIETARY_OPTIONS)[number]["id"];
export type LifestyleId = (typeof LIFESTYLE_OPTIONS)[number]["id"];
export type InterestId = (typeof INTEREST_OPTIONS)[number]["id"];