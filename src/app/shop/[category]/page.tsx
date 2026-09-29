import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ShopCatalog } from "@/components/shop-catalog";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  return {
    title: `Buy ${category.title} Online`,
    description: category.description,
    alternates: { canonical: `/shop/${category.slug}` },
    openGraph: { title: category.title, description: category.description, url: `/shop/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory((await params).category);
  if (!category) notFound();
  const products = await getProductsByCategory(category);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: absoluteUrl("/shop") },
      { "@type": "ListItem", position: 2, name: category.title, item: absoluteUrl(`/shop/${category.slug}`) },
    ],
  };

  return (
    <div className="bg-earth-100 pb-20">
      <JsonLd data={breadcrumbs} />
      <header className="border-b border-brand-green-100 bg-brand-green-50 py-12 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-brand-green-900">Shop {category.title}</h1>
        <p className="mx-auto max-w-2xl px-4 text-gray-600">{category.description}</p>
      </header>
      <ShopCatalog products={products} />
    </div>
  );
}
