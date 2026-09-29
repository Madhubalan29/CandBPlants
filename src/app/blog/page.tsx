import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plant Care Blog",
  description: "Tips, guides, and inspiration for nurturing your indoor jungle from C and B Potted Plants.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    title: "How Often Should You Really Water Succulents?",
    tag: "Plant Care",
    excerpt: "The number one reason succulents die indoors is overwatering. Learn the 'soak and dry' method to keep your fleshy friends thriving.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white pb-20">
      <header className="bg-brand-green-900 py-16 text-center text-white">
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">C&amp;B Plant Care Blog</h1>
        <p className="mx-auto max-w-2xl px-4 text-brand-green-100">Tips, guides, and inspiration for nurturing your indoor jungle.</p>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {posts.map((post) => (
          <article key={post.title} className="overflow-hidden rounded-2xl bg-earth-100 shadow-sm">
            <div className="relative h-48">
              <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase text-brand-green-700">{post.tag}</span>
              <h2 className="my-2 text-xl font-bold text-earth-900">{post.title}</h2>
              <p className="line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
