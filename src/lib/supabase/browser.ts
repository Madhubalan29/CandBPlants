import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

export function createBrowserDb() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

export function signInWithGoogle(next = window.location.pathname) {
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  return createBrowserDb().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
}
