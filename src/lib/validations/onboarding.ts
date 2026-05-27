import { z } from "zod";
import {
  DIETARY_OPTIONS,
  INTEREST_OPTIONS,
  LIFESTYLE_OPTIONS,
} from "@/lib/constants/preferences";
import {
  WARDROBE_CATEGORIES,
  WARDROBE_COLORS,
  WARDROBE_OCCASIONS,
  WARDROBE_SEASONS,
} from "@/lib/constants/wardrobe";

const dietaryIds = DIETARY_OPTIONS.map((o) => o.id);
const lifestyleIds = LIFESTYLE_OPTIONS.map((o) => o.id);
const interestIds = INTEREST_OPTIONS.map((o) => o.id);

const categoryIds = WARDROBE_CATEGORIES.map((o) => o.id);
const colorIds = WARDROBE_COLORS.map((o) => o.id);
const occasionIds = WARDROBE_OCCASIONS.map((o) => o.id);
const seasonIds = WARDROBE_SEASONS.map((o) => o.id);

export const profileSetupSchema = z
  .object({
    displayName: z.string().trim().max(50).optional().default(""),
    profilePhotoUrl: z
      .union([z.string().url(), z.literal(""), z.null()])
      .optional()
      .nullable(),
    skip: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.skip && !data.displayName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter the name you'd like us to use",
        path: ["displayName"],
      });
    }
  });

export const preferencesSchema = z.object({
  dietaryTags: z.array(z.enum(dietaryIds as [string, ...string[]])).default([]),
  lifestyleTags: z
    .array(z.enum(lifestyleIds as [string, ...string[]]))
    .default([]),
  interestTags: z
    .array(z.enum(interestIds as [string, ...string[]]))
    .default([]),
  skip: z.boolean().optional(),
});

export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;

// Wardrobe — Round 2 prototype scope
// Item update accepts a subset of fields so toggling favourite or fixing a tag
// goes through the same PATCH route without forcing a full payload.
export const wardrobeItemUpdateSchema = z.object({
  category: z.enum(categoryIds as [string, ...string[]]).nullable().optional(),
  colors: z.array(z.enum(colorIds as [string, ...string[]])).max(4).optional(),
  occasions: z
    .array(z.enum(occasionIds as [string, ...string[]]))
    .max(4)
    .optional(),
  seasons: z.array(z.enum(seasonIds as [string, ...string[]])).max(3).optional(),
  isFavorite: z.boolean().optional(),
});

// Wardrobe step completion — no item payload, just the "done / skip" signal.
export const wardrobeCompleteSchema = z.object({
  skip: z.boolean().optional(),
});

export type WardrobeItemUpdateInput = z.infer<typeof wardrobeItemUpdateSchema>;
export type WardrobeCompleteInput = z.infer<typeof wardrobeCompleteSchema>;
