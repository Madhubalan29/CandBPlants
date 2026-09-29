// Data access for the public catalogue. Pages only talk to these functions.
import { categories } from "@/data/categories";
import { publicDb } from "./supabase/public";
import type { Category, CategoryName, Product } from "./types";

export const PRODUCT_COLUMNS =
  "id, slug, name, scientific_name, category, description, current_price, original_price, best_seller, stock, " +
  "family, size, difficulty, light, tags, images, status, seller_id, created_at, updated_at";

export interface ProductRow {
  id: number;
  slug: string;
  name: string;
  scientific_name: string | null;
  category: CategoryName;
  description: string;
  current_price: number;
  original_price: number | null;
  best_seller: boolean;
  stock: number;
  family: string | null;
  size: string | null;
  difficulty: string | null;
  light: string | null;
  tags: string[];
  images: string[];
  status: "live" | "draft";
  seller_id: string | null;
  created_at: string;
  updated_at: string;
  reviews?: { author_name: string; rating: number; comment: string }[];
}

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    scientificName: row.scientific_name ?? undefined,
    category: row.category,
    description: row.description,
    currentPrice: Number(row.current_price),
    originalPrice: Number(row.original_price ?? row.current_price),
    bestSeller: row.best_seller,
    stock: row.stock,
    dateAdded: row.created_at.slice(0, 10),
    updatedAt: row.updated_at,
    images: row.images,
    tags: row.tags,
    family: row.family ?? undefined,
    size: row.size ?? undefined,
    difficulty: row.difficulty ?? undefined,
    light: row.light ?? undefined,
    reviews: (row.reviews ?? []).map((r) => ({ author: r.author_name, rating: r.rating, comment: r.comment })),
  };
}

function productQuery() {
  return publicDb
    .from("products")
    .select(`${PRODUCT_COLUMNS}, reviews(author_name, rating, comment, created_at)`)
    .eq("status", "live")
    .order("created_at", { referencedTable: "reviews", ascending: false });
}

async function run(query: PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<Product[]> {
  const { data, error } = await query;
  if (error) throw new Error(`Catalogue query failed: ${error.message}`);
  return (data as ProductRow[]).map(toProduct);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getAllProducts(): Promise<Product[]> {
  return run(productQuery().order("id"));
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  return run(productQuery().eq("category", category.name).order("id"));
}

export async function getProduct(categorySlug: string, slug: string): Promise<Product | undefined> {
  const category = await getCategory(categorySlug);
  if (!category) return undefined;
  const [product] = await run(productQuery().eq("category", category.name).eq("slug", slug).limit(1));
  return product;
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return run(productQuery().eq("best_seller", true).eq("category", "Plants").gt("stock", 0).order("id").limit(limit));
}
