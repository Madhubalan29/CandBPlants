import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-4 py-32 text-center">
      <Leaf size={56} className="mb-6 text-brand-green-700" />
      <h1 className="mb-4 font-serif text-4xl font-bold text-brand-green-900">Page not found</h1>
      <p className="mb-8 max-w-md text-gray-600">This page may have moved, or the plant has found a new home.</p>
      <Link href="/shop" className="rounded-full bg-brand-green-700 px-8 py-3 font-semibold text-white hover:bg-brand-green-800">
        Browse the shop
      </Link>
    </div>
  );
}
