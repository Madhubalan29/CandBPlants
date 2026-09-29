import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

// Anonymous, cookie-free client for public catalogue reads. Because it never touches cookies,
// shop pages stay statically generated (fast and SEO-friendly) and only see live products.
export const publicDb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
