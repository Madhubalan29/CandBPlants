import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Seller dashboard", robots: { index: false, follow: false } };

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getCurrentProfile();
  const link = "rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-white hover:text-brand-green-700";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {profile && profile.role !== "customer" && (
        <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          <span className="mr-4 font-serif text-xl font-bold text-brand-green-900">Seller dashboard</span>
          <Link href="/seller" className={link}>Products</Link>
          {profile.role === "admin" && <Link href="/seller/team" className={link}>Team</Link>}
          <span className="ml-auto text-xs text-gray-500">{profile.email} · {profile.role}</span>
        </nav>
      )}
      {children}
    </div>
  );
}
