import Link from "next/link";
import type { Product } from "@/lib/types";
import { averageRating, productPath } from "@/lib/product-utils";
import { formatPrice } from "@/lib/site";
import { AddToCartButton } from "./add-to-cart-button";
import { CardImages } from "./card-images";
import { RatingSummary } from "./rating";

export function ProductCard({ product }: { product: Product }) {
  const href = productPath(product);
  const inStock = product.stock > 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
        <CardImages images={product.images} alt={product.name} />
        {!inStock ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 shadow-md">Out of Stock</span>
        ) : product.bestSeller ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-900 shadow-md">Best Seller</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-700">{product.category}</span>
        <h3 className="mb-1 font-serif text-lg font-bold leading-tight text-earth-900 transition-colors group-hover:text-brand-green-700">
          {/* Stretched link: the whole card is clickable without nesting the cart button inside <a>. */}
          <Link href={href} className="after:absolute after:inset-0">{product.name}</Link>
        </h3>
        <RatingSummary average={averageRating(product)} count={product.reviews.length} />
        <p className="mb-4 mt-3 line-clamp-2 flex-1 text-sm text-gray-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${inStock ? "text-brand-green-700" : "text-gray-400"}`}>{formatPrice(product.currentPrice)}</span>
            {product.originalPrice > product.currentPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <AddToCartButton product={product} href={href} />
        </div>
      </div>
    </article>
  );
}
