// Pure helpers that are safe to use in client components (no data access).
import { categories } from "@/data/categories";
import type { Product } from "./types";

export function categorySlugFor(product: Pick<Product, "category">): string {
  return categories.find((c) => c.name === product.category)!.slug;
}

export function productPath(product: Pick<Product, "category" | "slug">): string {
  return `/shop/${categorySlugFor(product)}/${product.slug}`;
}

export function averageRating(product: Pick<Product, "reviews">): number {
  const { reviews } = product;
  return reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
}
