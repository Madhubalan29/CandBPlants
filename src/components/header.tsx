"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Leaf, Menu, ShoppingCart, X } from "lucide-react";
import { categories } from "@/data/categories";
import { AuthMenu } from "./auth-menu";
import { useCart } from "./providers";

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} className="relative p-2 text-earth-800 transition-colors hover:text-brand-green-700" aria-label={`Open cart, ${count} items`}>
      <ShoppingCart size={22} />
      <span className="absolute right-0 top-0 inline-flex min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-brand-green-700 px-1.5 py-0.5 text-xs font-bold leading-none text-white">
        {count}
      </span>
    </button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMenuOpen(false), [pathname]);

  const link = "font-medium text-earth-800 transition-colors hover:text-brand-green-700";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.jpg" alt="C and B Potted Plants logo" width={48} height={48} className="h-12 w-12 rounded-md object-contain" priority />
          <span className="font-serif text-2xl font-bold tracking-tight text-brand-green-900">C&amp;B</span>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          <Link href="/" className={link}>Home</Link>
          <div className="group relative">
            <Link href="/shop" className={`${link} flex items-center gap-1 py-6`}>
              Shop <ChevronDown size={12} />
            </Link>
            <div className="invisible absolute z-50 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {categories.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  className={i === 0
                    ? "flex items-center gap-2 border-b border-gray-50 px-5 py-3 text-sm font-bold text-brand-green-900 hover:bg-brand-green-50"
                    : "block px-5 py-3 text-sm text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700"}
                >
                  {i === 0 && <Leaf size={14} className="text-brand-green-500" />}
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/blog" className={link}>Blog</Link>
          <Link href="/#about" className={link}>About</Link>
        </div>

        <div className="flex items-center gap-2">
          <AuthMenu />
          <CartButton />
          <button onClick={() => setMenuOpen((o) => !o)} className="p-2 text-earth-800 md:hidden" aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-earth-100 bg-white md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 shadow-lg sm:px-3">
            <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-brand-green-50">Home</Link>
            <div className="my-2 border-y border-gray-100 py-2">
              <Link href="/shop" className="block px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">Shop Catalog</Link>
              {categories.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  className={`block rounded-md px-5 py-2 text-base hover:bg-brand-green-50 ${i === 0 ? "font-bold text-brand-green-700" : "font-medium text-gray-600"}`}
                >
                  {c.title}
                </Link>
              ))}
            </div>
            <Link href="/blog" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-brand-green-50">Blog</Link>
            <Link href="/#about" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-brand-green-50">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
