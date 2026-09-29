import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { getBestSellers } from "@/lib/catalog";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const bestSellers = await getBestSellers();

  return (
    <>
      <section className="relative overflow-hidden bg-brand-green-900">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8 lg:py-48">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-green-100 md:text-base">Welcome to C &amp; B Potted Plants</p>
          <h1 className="mb-6 max-w-4xl font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            Breathe Life Into Your Space with Nature&apos;s Finest
          </h1>
          <Link href="/shop/plants" className="rounded-full bg-brand-green-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-brand-green-700">
            Shop Plants
          </Link>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-brand-green-900 md:text-4xl">Our Best Selling Plants</h2>
            <p className="mx-auto max-w-2xl text-gray-600">The most loved indoor and outdoor greenery by our community.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 bg-brand-green-50 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl lg:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1598539958784-07dcc26da896?auto=format&fit=crop&w=1200&q=80"
              alt="Hands caring for a potted plant"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <p className="mb-2 font-semibold uppercase tracking-wider text-brand-green-700">Our Story</p>
            <h2 className="mb-6 font-serif text-3xl font-bold text-brand-green-900 md:text-4xl">Rooted in Passion for Nature</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              At <strong className="text-brand-green-800">C and B Potted Plants</strong>, our main focus is helping you build your indoor jungle.
              While we procure the best pots and fertilizers to support your journey, our true passion is nurturing and providing the finest potted plants for your home.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              <div><dt className="mb-1 text-2xl font-bold text-brand-green-700">100+</dt><dd className="text-sm font-medium text-gray-600">Plant Varieties</dd></div>
              <div><dt className="mb-1 text-2xl font-bold text-brand-green-700">Expert</dt><dd className="text-sm font-medium text-gray-600">Care Advice</dd></div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
