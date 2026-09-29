import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description: "Explore our premium potted plants and hand-selected pots, fertilizers, seeds and gardening accessories.",
  alternates: { canonical: "/shop" },
};

export default async function ShopHubPage() {
  const [plants, ...others] = await getCategories();

  return (
    <div className="bg-earth-100 pb-20">
      <header className="border-b border-brand-green-100 bg-brand-green-50 py-12 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-brand-green-900">Our Collections</h1>
        <p className="mx-auto max-w-2xl px-4 text-gray-600">Explore our premium plants and hand-selected gardening accessories.</p>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href={`/shop/${plants.slug}`} className="group relative mb-8 block h-80 overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-lg md:h-[400px]">
          <Image src={plants.image} alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 md:p-12">
            <span className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-green-500">Our Specialty</span>
            <h2 className="mb-4 font-serif text-4xl font-bold text-white md:text-5xl">{plants.title}</h2>
            <p className="mb-6 max-w-2xl text-lg text-brand-green-50">{plants.description}</p>
            <span className="flex w-max items-center gap-2 rounded-full bg-brand-green-500 px-8 py-3 font-bold text-white shadow-lg">
              Shop All Plants <ArrowRight size={18} />
            </span>
          </div>
        </Link>

        <h2 className="mb-6 mt-12 font-serif text-2xl font-bold text-earth-900">Plant Care &amp; Accessories</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {others.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="p-5 text-center text-lg font-bold text-earth-900">{c.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
