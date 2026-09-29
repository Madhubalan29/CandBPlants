// Allowed values shared by the shop filters and the seller product form.
import type { CategoryName } from "./types";

export const CATEGORY_NAMES: CategoryName[] = ["Plants", "Pots", "Fertilizers", "Seeds", "Accessories"];

export const MAIN_FAMILIES = ["Monstera", "Philodendron", "Ficus", "Syngonium"];

export const attributeOptions = {
  family: [...MAIN_FAMILIES, "Other"],
  size: ["Cutting", "Up to 50 cm", "50 cm to 100 cm", "Over 100 cm"],
  difficulty: ["Easy", "Intermediate", "Experienced plant parent"],
  light: ["Plenty of light to shade", "Plenty of light to half shade", "Plenty of light but no direct sunlight", "Half shade to shade"],
} as const;

export type AttributeKey = keyof typeof attributeOptions;

export const attributeLabels: Record<AttributeKey, string> = {
  family: "Plant Family",
  size: "Size",
  difficulty: "Difficulty",
  light: "Light",
};
