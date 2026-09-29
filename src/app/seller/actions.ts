"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireStaff } from "@/lib/auth";
import { attributeOptions, CATEGORY_NAMES, type AttributeKey } from "@/lib/options";
import { PRODUCT_IMAGE_BUCKET, PRODUCT_IMAGE_PREFIX } from "@/lib/supabase/env";
import type { CategoryName } from "@/lib/types";

export type FormState = { error?: string };

const MAX_IMAGES = 8;
const ALLOWED_IMAGE_PREFIXES = [PRODUCT_IMAGE_PREFIX, "/images/products/", "https://images.unsplash.com/"];

function slugify(text: string) {
  return (
    text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
    "product"
  );
}

async function uniqueSlug(db: SupabaseClient, name: string) {
  const base = slugify(name).slice(0, 80);
  const { data } = await db.from("products").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug as string));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// Deletes uploaded photos that are no longer used. Photos bundled with the site are left alone.
async function removeStoredImages(db: SupabaseClient, urls: string[]) {
  const paths = urls.filter((u) => u.startsWith(PRODUCT_IMAGE_PREFIX)).map((u) => u.slice(PRODUCT_IMAGE_PREFIX.length));
  if (paths.length) await db.storage.from(PRODUCT_IMAGE_BUCKET).remove(paths);
}

export async function saveProduct(_prev: FormState, form: FormData): Promise<FormState> {
  const { db, profile } = await requireStaff();
  const str = (key: string) => String(form.get(key) ?? "").trim();
  const id = str("id") ? Number(str("id")) : null;

  const name = str("name");
  const description = str("description");
  const category = str("category") as CategoryName;
  const currentPrice = Number(str("currentPrice"));
  const originalPrice = str("originalPrice") ? Number(str("originalPrice")) : null;
  const stock = Number(str("stock"));
  const status = str("status") === "draft" ? "draft" : "live";
  const images = form.getAll("images").map(String);
  const tags = str("tags").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10);

  if (!name || name.length > 120) return { error: "Name is required (max 120 characters)." };
  if (!description || description.length > 2000) return { error: "Description is required (max 2000 characters)." };
  if (!CATEGORY_NAMES.includes(category)) return { error: "Choose a category." };
  if (!Number.isFinite(currentPrice) || currentPrice < 0) return { error: "Enter a valid selling price." };
  if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice < currentPrice)) {
    return { error: "The original (MRP) price should be at least the selling price, or left empty." };
  }
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number, 0 or more." };
  if (images.length > MAX_IMAGES) return { error: `Up to ${MAX_IMAGES} photos per product.` };
  if (images.some((url) => !ALLOWED_IMAGE_PREFIXES.some((p) => url.startsWith(p)))) return { error: "One of the photos has an invalid address." };

  // Family, difficulty and light only make sense for plants; size applies to any category.
  const attributes: Partial<Record<AttributeKey, string | null>> = {};
  for (const key of Object.keys(attributeOptions) as AttributeKey[]) {
    const value = str(key) || null;
    const applies = key === "size" || category === "Plants";
    if (value && !(attributeOptions[key] as readonly string[]).includes(value)) return { error: `Invalid ${key}.` };
    attributes[key] = applies ? value : null;
  }

  const row = {
    name,
    scientific_name: str("scientificName") || null,
    category,
    description,
    current_price: currentPrice,
    original_price: originalPrice,
    best_seller: form.get("bestSeller") === "on",
    stock,
    tags,
    images,
    status,
    ...attributes,
  };

  if (id) {
    const { data: before } = await db.from("products").select("images").eq("id", id).single();
    // RLS silently skips rows the user may not edit, so zero updated rows means "not allowed".
    const { data, error } = await db.from("products").update(row).eq("id", id).select("id");
    if (error) return { error: `Couldn't save: ${error.message}` };
    if (!data?.length) return { error: "You can only edit products you added (admins can edit all)." };
    await removeStoredImages(db, ((before?.images as string[]) ?? []).filter((u) => !images.includes(u)));
  } else {
    const slug = await uniqueSlug(db, name);
    const { error } = await db.from("products").insert({ ...row, slug, seller_id: profile.id });
    if (error) return { error: `Couldn't save: ${error.message}` };
  }

  revalidatePath("/", "layout");
  redirect(`/seller?saved=${encodeURIComponent(name)}`);
}

export async function deleteProduct(form: FormData) {
  const { db } = await requireStaff();
  const id = Number(form.get("id"));
  const { data } = await db.from("products").delete().eq("id", id).select("images");
  if (data?.length) await removeStoredImages(db, data[0].images as string[]);
  revalidatePath("/", "layout");
  redirect("/seller");
}

export async function inviteStaff(_prev: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireStaff({ admin: true });
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const role = form.get("role") === "admin" ? "admin" : "seller";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  const { error } = await db.from("staff_invites").upsert({ email, role });
  if (error) return { error: error.message };
  // If they've already signed in once, promote their existing account too.
  await db.from("profiles").update({ role }).eq("email", email);
  revalidatePath("/seller/team");
  return {};
}

export async function removeStaff(form: FormData) {
  const { db, profile } = await requireStaff({ admin: true });
  const email = String(form.get("email") ?? "").toLowerCase();
  if (email === profile.email) return; // Don't let the admin lock themselves out.
  await db.from("staff_invites").delete().eq("email", email);
  await db.from("profiles").update({ role: "customer" }).eq("email", email);
  revalidatePath("/seller/team");
}
