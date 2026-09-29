import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/seller/product-form";
import { DeleteProductButton } from "@/components/seller/delete-product-button";
import { requireStaff } from "@/lib/auth";
import { PRODUCT_COLUMNS, type ProductRow } from "@/lib/catalog";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { db, profile } = await requireStaff();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const { data } = await db.from("products").select(PRODUCT_COLUMNS).eq("id", id).maybeSingle();
  const product = data as unknown as ProductRow | null;
  if (!product) notFound();

  const canEdit = profile.role === "admin" || product.seller_id === profile.id;

  return (
    <>
      <Link href="/seller" className="mb-4 inline-block text-sm text-brand-green-700 hover:underline">← All products</Link>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-earth-900">Edit {product.name}</h1>
        {canEdit && <DeleteProductButton id={product.id} name={product.name} />}
      </div>
      {canEdit ? (
        <ProductForm product={product} userId={profile.id} />
      ) : (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-amber-800">Only the person who added this product, or an admin, can edit it.</p>
      )}
    </>
  );
}
