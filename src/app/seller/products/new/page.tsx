import Link from "next/link";
import { ProductForm } from "@/components/seller/product-form";
import { requireStaff } from "@/lib/auth";

export default async function NewProductPage() {
  const { profile } = await requireStaff();
  return (
    <>
      <Link href="/seller" className="mb-4 inline-block text-sm text-brand-green-700 hover:underline">← All products</Link>
      <h1 className="mb-6 font-serif text-3xl font-bold text-earth-900">Add a product</h1>
      <ProductForm userId={profile.id} />
    </>
  );
}
