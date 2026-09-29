import { redirect } from "next/navigation";
import { createServerDb } from "./supabase/server";

export type Role = "customer" | "seller" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
}

export async function getCurrentProfile() {
  const db = await createServerDb();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { db, profile: null };
  const { data: profile } = await db.from("profiles").select("id, email, full_name, avatar_url, role").eq("id", user.id).single<Profile>();
  return { db, profile };
}

// For seller pages and actions: signed-in staff only. The database rules enforce the same thing;
// this check gives people a friendly redirect instead of a failed query.
export async function requireStaff(options: { admin?: boolean } = {}) {
  const { db, profile } = await getCurrentProfile();
  if (!profile) redirect("/signin?next=/seller");
  if (profile.role === "customer" || (options.admin && profile.role !== "admin")) redirect("/seller/no-access");
  return { db, profile };
}
