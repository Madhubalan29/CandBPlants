"use client";

import { useMemo, useState } from "react";
import { Leaf } from "lucide-react";
import { attributeLabels, attributeOptions, MAIN_FAMILIES, type AttributeKey } from "@/lib/options";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

const PRICE_MAX = 5000;
const PRICE_STEP = 50;

const filterGroups: { id: "availability" | AttributeKey; name: string; options: readonly string[] }[] = [
  { id: "availability", name: "Availability", options: ["Available", "Out of Stock"] },
  ...(Object.keys(attributeOptions) as AttributeKey[]).map((id) => ({ id, name: attributeLabels[id], options: attributeOptions[id] })),
];

type Sort = "relevant" | "bestseller" | "new" | "price-low-high" | "price-high-low";

const sorters: Record<Sort, (a: Product, b: Product) => number> = {
  relevant: (a, b) => a.id - b.id,
  bestseller: (a, b) => Number(b.bestSeller) - Number(a.bestSeller),
  new: (a, b) => b.dateAdded.localeCompare(a.dateAdded),
  "price-low-high": (a, b) => a.currentPrice - b.currentPrice,
  "price-high-low": (a, b) => b.currentPrice - a.currentPrice,
};

export function ShopCatalog({ products }: { products: Product[] }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<Sort>("relevant");

  // Only offer attribute filters that at least one product in this category actually has.
  const groups = useMemo(
    () => filterGroups.filter(({ id }) => id === "availability" || products.some((p) => p[id])),
    [products],
  );

  const filtered = useMemo(() => {
    const has = (group: string) => checked[group]?.length;
    const result = products.filter((p) => {
      if (p.currentPrice < minPrice || p.currentPrice > maxPrice) return false;
      if (has("availability")) {
        const inStock = p.stock > 0;
        const wants = checked.availability;
        if (!((wants.includes("Available") && inStock) || (wants.includes("Out of Stock") && !inStock))) return false;
      }
      if (has("family")) {
        const family = p.family && MAIN_FAMILIES.includes(p.family) ? p.family : "Other";
        if (!checked.family.includes(family)) return false;
      }
      for (const key of ["size", "difficulty", "light"] as const) {
        if (has(key) && !checked[key].includes(p[key] ?? "")) return false;
      }
      return true;
    });
    return result.sort(sorters[sort]);
  }, [products, minPrice, maxPrice, checked, sort]);

  function toggle(group: string, option: string) {
    setChecked((prev) => {
      const current = prev[group] ?? [];
      return { ...prev, [group]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option] };
    });
  }

  function clearFilters() {
    setChecked({});
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setSort("relevant");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
      <aside className="w-full shrink-0 md:w-72">
        <div className="top-24 h-max max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:sticky">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold text-earth-900">Filters</h2>
            <button onClick={clearFilters} className="text-xs font-bold text-brand-green-700 hover:underline">Clear All</button>
          </div>

          <fieldset className="mb-6 border-b pb-6">
            <legend className="mb-4 text-sm font-bold uppercase tracking-wider text-earth-900">Price Range</legend>
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <span>₹{minPrice}</span>
              <span>₹{maxPrice}</span>
            </div>
            <div className="range-slider">
              <div className="progress" style={{ left: `${(minPrice / PRICE_MAX) * 100}%`, right: `${100 - (maxPrice / PRICE_MAX) * 100}%` }} />
              <input type="range" aria-label="Minimum price" min={0} max={PRICE_MAX} step={PRICE_STEP} value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - PRICE_STEP))} />
              <input type="range" aria-label="Maximum price" min={0} max={PRICE_MAX} step={PRICE_STEP} value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + PRICE_STEP))} />
            </div>
          </fieldset>

          <div className="space-y-6">
            {groups.map((g) => (
              <fieldset key={g.id} className="mb-5 border-b border-gray-100 pb-5 last:border-0">
                <legend className="mb-3 text-sm font-bold uppercase tracking-wider text-earth-900">{g.name}</legend>
                <div className="space-y-2 pl-1">
                  {g.options.map((opt) => (
                    <label key={opt} className="group flex cursor-pointer items-center gap-3">
                      <input type="checkbox" className="filter-checkbox" checked={checked[g.id]?.includes(opt) ?? false} onChange={() => toggle(g.id, opt)} />
                      <span className="text-sm text-gray-600 transition-colors group-hover:text-brand-green-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-gray-500">{filtered.length} products found</p>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort products"
            className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none sm:w-auto">
            <option value="relevant">Most Relevant</option>
            <option value="bestseller">Best Seller</option>
            <option value="new">New In</option>
            <option value="price-low-high">Increasing Price</option>
            <option value="price-high-low">Decreasing Price</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <Leaf size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600">No products match your filters</h3>
            <p className="mt-2 text-gray-500">Try adjusting the price range or clearing some checkboxes.</p>
            <button onClick={clearFilters} className="mt-6 rounded-lg bg-brand-green-100 px-6 py-2 font-semibold text-brand-green-800 transition hover:bg-brand-green-200">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
