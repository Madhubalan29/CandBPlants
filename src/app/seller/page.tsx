import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Leaf, Plus } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { PRODUCT_COLUMNS, toProduct, type ProductRow } from "@/lib/catalog";
import { productPath } from "@/lib/product-utils";
import { formatPrice } from "@/lib/site";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function SellerProductsPage({ searchParams }: Props) {
  const { db, profile } = await requireStaff();
  const { saved } = await searchParams;
  const { data, error } = await db.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = data as unknown as ProductRow[];
  const canEdit = (row: ProductRow) => profile.role === "admin" || row.seller_id === profile.id;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-earth-900">Products <span className="text-lg font-normal text-gray-400">({rows.length})</span></h1>
        <Link href="/seller/products/new" className="flex items-center gap-2 rounded-xl bg-brand-green-700 px-5 py-3 font-bold text-white shadow hover:bg-brand-green-800">
          <Plus size={18} /> Add product
        </Link>
      </div>

      {saved && (
        <p className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 size={16} /> Saved “{saved}”. The shop pages update automatically.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4" /></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-brand-green-50">
                      {row.images[0] ? <Image src={row.images[0]} alt="" fill sizes="48px" className="object-cover" /> : <Leaf size={20} className="absolute inset-0 m-auto text-brand-green-700" />}
                    </div>
                    <div>
                      <p className="font-semibold text-earth-900">{row.name}</p>
                      {row.status === "live" && <Link href={productPath(toProduct(row))} className="text-xs text-brand-green-700 hover:underline">View in shop</Link>}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{row.category}</td>
                <td className="p-4 font-medium">{formatPrice(Number(row.current_price))}</td>
                <td className={`p-4 font-medium ${row.stock === 0 ? "text-red-600" : row.stock < 5 ? "text-amber-600" : ""}`}>{row.stock}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${row.status === "live" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{row.status === "live" ? "Live" : "Draft"}</span>
                </td>
                <td className="p-4 text-right">
                  {canEdit(row) ? <Link href={`/seller/products/${row.id}`} className="font-semibold text-brand-green-700 hover:underline">Edit</Link> : <span className="text-xs text-gray-400">Not yours</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
