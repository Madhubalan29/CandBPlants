"use server";

import { revalidatePath } from "next/cache";
import { createServerDb } from "@/lib/supabase/server";

export type ReviewState = { ok?: boolean; error?: string };

export async function submitReview(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const productId = Number(form.get("productId"));
  const path = String(form.get("path") ?? "");
  const rating = Number(form.get("rating"));
  const comment = String(form.get("comment") ?? "").trim();

  if (!Number.isInteger(productId) || !path.startsWith("/shop/")) return { error: "Invalid product." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Choose a rating from 1 to 5." };
  if (comment.length < 3 || comment.length > 1000) return { error: "Reviews must be 3–1000 characters." };

  const db = await createServerDb();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { error: "Please sign in to leave a review." };

  // author_name is overwritten by a database trigger with the reviewer's Google name.
  const { error } = await db.from("reviews").insert({ product_id: productId, user_id: user.id, rating, comment, author_name: "-" });
  if (error) {
    return { error: error.code === "23505" ? "You've already reviewed this product." : "Couldn't save your review. Please try again." };
  }

  revalidatePath(path);
  return { ok: true };
}
