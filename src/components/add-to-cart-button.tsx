"use client";

import { Ban, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "./providers";

interface Props {
  product: { id: number; name: string; currentPrice: number; stock: number; images: string[] };
  href: string;
  variant?: "icon" | "full";
}

export function AddToCartButton({ product, href, variant = "icon" }: Props) {
  const { add } = useCart();
  const inStock = product.stock > 0;
  const onClick = () =>
    add({ id: product.id, name: product.name, href, price: product.currentPrice, image: product.images[0], stock: product.stock });

  if (variant === "full") {
    return inStock ? (
      <button onClick={onClick} className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-green-700 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-brand-green-800">
        <ShoppingCart size={20} /> Add to Cart
      </button>
    ) : (
      <button disabled className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-gray-300 py-4 text-lg font-bold text-gray-500">
        <Ban size={20} /> Currently Unavailable
      </button>
    );
  }

  return inStock ? (
    <button onClick={onClick} aria-label={`Add ${product.name} to cart`} className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green-900 text-white shadow-md transition-colors hover:bg-brand-green-700">
      <Plus size={16} />
    </button>
  ) : (
    <button disabled aria-label="Out of stock" className="relative z-10 flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-gray-300 text-gray-500">
      <Ban size={16} />
    </button>
  );
}
