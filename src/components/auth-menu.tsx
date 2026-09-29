"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Store, User, Users } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { createBrowserDb } from "@/lib/supabase/browser";

// Auth state is read in the browser so shop pages remain static for search engines.
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const db = createBrowserDb();
    const load = async (u: AuthUser | null) => {
      setUser(u);
      if (!u) return setRole(null);
      const { data } = await db.from("profiles").select("role").eq("id", u.id).single();
      setRole(data?.role ?? "customer");
    };
    db.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    const { data: sub } = db.auth.onAuthStateChange((_event, session) => {
      // Defer so the Supabase client isn't queried from inside its own callback.
      setTimeout(() => load(session?.user ?? null), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, role, isStaff: role === "seller" || role === "admin", isAdmin: role === "admin" };
}

export function AuthMenu() {
  const { user, isStaff, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setOpen(false), [pathname]);

  if (!user) {
    return (
      <Link href={`/signin?next=${encodeURIComponent(pathname)}`} className="flex items-center gap-1 p-2 text-sm font-medium text-earth-800 hover:text-brand-green-700" aria-label="Sign in">
        <User size={20} /> <span className="hidden lg:inline">Sign in</span>
      </Link>
    );
  }

  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email;
  const item = "flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-brand-green-50";

  async function signOut() {
    await createBrowserDb().auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center rounded-full p-1 hover:ring-2 hover:ring-brand-green-100" aria-label="Account menu" aria-expanded={open}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny avatar from Google, not worth optimizing
          <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-700 text-sm font-bold text-white">{name?.[0]?.toUpperCase()}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
          <p className="truncate border-b border-gray-100 px-4 pb-2 text-xs text-gray-500">{name}</p>
          {isStaff && <Link href="/seller" className={item}><Store size={16} /> Seller dashboard</Link>}
          {isAdmin && <Link href="/seller/team" className={item}><Users size={16} /> Team</Link>}
          <button onClick={signOut} className={item}><LogOut size={16} /> Sign out</button>
        </div>
      )}
    </div>
  );
}
