import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { categories } from "@/data/categories";
import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./brand-icons";

export function Footer() {
  const social = "flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-800 text-white transition";
  return (
    <footer className="mt-auto bg-brand-green-900 py-16 text-brand-green-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 border-b border-brand-green-800 px-4 pb-12 md:grid-cols-4">
        <div>
          <Link href="/" className="mb-4 flex items-center gap-3">
            <Image src="/images/logo.jpg" alt="" width={40} height={40} className="h-10 w-10 rounded bg-white object-contain p-1" />
            <span className="font-serif text-2xl font-bold text-white">C&amp;B Plants</span>
          </Link>
          <p className="text-sm text-brand-green-100/80">
            Bringing nature&apos;s beauty into your everyday life. Premium potted plants and accessories delivered with care.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Shop Categories</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/shop/${c.slug}`} className="hover:text-white">{c.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Company</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Contact Us</h2>
          <ul className="mb-4 space-y-2 text-sm">
            <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white"><Phone size={14} /> {site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white"><Mail size={14} /> {site.email}</a></li>
          </ul>
          <div className="flex gap-4">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${social} hover:bg-brand-green-500`}><InstagramIcon className="h-5 w-5" /></a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${social} hover:bg-blue-600`}><FacebookIcon className="h-5 w-5" /></a>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`${social} hover:bg-green-500`}><WhatsAppIcon className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <p className="pt-8 text-center text-sm text-brand-green-100/60">&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
    </footer>
  );
}
