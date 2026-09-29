import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { JsonLd } from "@/components/json-ld";
import { ProductGallery } from "@/components/product-gallery";
import { ReviewForm } from "@/components/review-form";
import { Stars } from "@/components/rating";
import { getAllProducts, getCategory, getProduct } from "@/lib/catalog";
import { averageRating, categorySlugFor, productPath } from "@/lib/product-utils";
import { absoluteUrl, formatPrice, site } from "@/lib/site";

type Props = { params: Promise<{ category: string; slug: string }> };

// New products render on first visit; seller edits refresh pages via revalidatePath.
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ category: categorySlugFor(p), slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) return {};
  const path = productPath(product);
  const title = product.scientificName ? `${product.name} (${product.scientificName})` : product.name;
  const description = `${product.description} Buy online for ${formatPrice(product.currentPrice)} from ${site.name}.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const [product, category] = await Promise.all([getProduct(categorySlug, slug), getCategory(categorySlug)]);
  if (!product || !category) notFound();

  const path = productPath(product);
  const inStock = product.stock > 0;
  const rating = averageRating(product);
  const details = (
    [["Family", product.family], ["Size", product.size], ["Difficulty", product.difficulty], ["Light", product.light]] as const
  ).filter(([, value]) => value);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      sku: `CB-${product.id}`,
      image: product.images.map(absoluteUrl),
      brand: { "@type": "Brand", name: site.name },
      category: category.title,
      offers: {
        "@type": "Offer",
        url: absoluteUrl(path),
        price: product.currentPrice.toFixed(2),
        priceCurrency: "INR",
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
      ...(product.reviews.length > 0 && {
        aggregateRating: { "@type": "AggregateRating", ratingValue: rating.toFixed(1), reviewCount: product.reviews.length },
        review: product.reviews.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.author },
          reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
          reviewBody: r.comment,
        })),
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shop", item: absoluteUrl("/shop") },
        { "@type": "ListItem", position: 2, name: category.title, item: absoluteUrl(`/shop/${category.slug}`) },
        { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(path) },
      ],
    },
  ];

  return (
    <div className="bg-white py-12">
      <JsonLd data={structuredData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href={`/shop/${category.slug}`} className="flex items-center gap-2 font-medium text-brand-green-700 hover:underline">
            <ArrowLeft size={16} /> Back to {category.title}
          </Link>
        </nav>

        <div className="flex flex-col gap-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg md:flex-row md:p-10">
          <div className="w-full md:w-1/2">
            <ProductGallery images={product.images} alt={product.name} />
          </div>
          <div className="flex w-full flex-col justify-center md:w-1/2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-600">{product.category}</span>
              {inStock ? (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800"><Check size={12} /> In Stock ({product.stock} left)</span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800"><X size={12} /> Out of Stock</span>
              )}
              {product.bestSeller && <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">BEST SELLER</span>}
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold leading-tight text-earth-900 md:text-5xl">{product.name}</h1>
            {product.scientificName && <p className="mb-6 text-lg italic text-gray-500">{product.scientificName}</p>}
            <div className="mb-6 flex items-center gap-4">
              {product.reviews.length > 0 ? (
                <>
                  <Stars value={rating} size={18} />
                  <span className="font-medium text-gray-600">{rating.toFixed(1)} out of 5 ({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})</span>
                </>
              ) : (
                <span className="rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-500">No reviews yet</span>
              )}
            </div>
            <div className="mb-8 flex items-end gap-4">
              <span className={`text-4xl font-bold ${inStock ? "text-brand-green-700" : "text-gray-400"}`}>{formatPrice(product.currentPrice)}</span>
              {product.originalPrice > product.currentPrice && (
                <span className="mb-1 text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">{product.description}</p>

            {details.length > 0 && (
              <dl className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt className="block text-xs font-bold uppercase text-gray-400">{label}</dt>
                    <dd className="text-sm font-medium text-gray-800">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <AddToCartButton product={product} href={path} variant="full" />
          </div>
        </div>

        <section className="mt-12 rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <h2 className="mb-8 border-b pb-4 font-serif text-2xl font-bold text-earth-900">Customer Reviews</h2>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="h-min rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-brand-green-900">Write a Review</h3>
              <ReviewForm productId={product.id} path={path} />
            </div>
            <div className="max-h-[450px] space-y-2 overflow-y-auto pr-4">
              {product.reviews.length === 0 && <p className="italic text-gray-500">No reviews yet.</p>}
              {product.reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 py-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-earth-900">{r.author}</span>
                    <Stars value={r.rating} size={10} />
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
