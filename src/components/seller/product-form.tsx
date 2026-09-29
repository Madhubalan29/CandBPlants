"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { saveProduct, type FormState } from "@/app/seller/actions";
import type { ProductRow } from "@/lib/catalog";
import { attributeLabels, attributeOptions, CATEGORY_NAMES, type AttributeKey } from "@/lib/options";
import { createBrowserDb } from "@/lib/supabase/browser";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase/env";

const MAX_SIDE = 1600;

// Phone photos are 3–5 MB; shrink to at most 1600px JPEG before uploading.
async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))), "image/jpeg", 0.85),
  );
}

export function ProductForm({ product, userId }: { product?: ProductRow; userId: string }) {
  const [state, action, saving] = useActionState<FormState, FormData>(saveProduct, {});
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [category, setCategory] = useState<string>(product?.category ?? "Plants");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError(null);
    const storage = createBrowserDb().storage.from(PRODUCT_IMAGE_BUCKET);
    try {
      for (const file of Array.from(files)) {
        const blob = await resizeImage(file);
        const path = `${userId}/${crypto.randomUUID()}.jpg`;
        const { error } = await storage.upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        const url = storage.getPublicUrl(path).data.publicUrl;
        setImages((prev) => [...prev, url]);
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function move(index: number, delta: number) {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });
  }

  const field = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-brand-green-500 focus:outline-none";
  const label = "mb-1 block text-sm font-medium text-gray-700";
  const attributesShown = (Object.keys(attributeOptions) as AttributeKey[]).filter((k) => k === "size" || category === "Plants");

  return (
    <form action={action} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}
      {images.map((url) => <input key={url} type="hidden" name="images" value={url} />)}

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-earth-900">Photos</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative h-28 w-28 overflow-hidden rounded-lg border border-gray-200">
              <Image src={url} alt="" fill sizes="112px" className="object-cover" />
              {i === 0 && <span className="absolute left-1 top-1 rounded bg-brand-green-700 px-1.5 py-0.5 text-[10px] font-bold text-white">COVER</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1 text-white">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left" className="disabled:opacity-30"><ArrowLeft size={16} /></button>
                <button type="button" onClick={() => setImages((prev) => prev.filter((u) => u !== url))} aria-label="Remove photo"><Trash2 size={16} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move right" className="disabled:opacity-30"><ArrowRight size={16} /></button>
              </div>
            </div>
          ))}
          {images.length < 8 && (
            <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-green-500 hover:text-brand-green-700">
              {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
              {uploading ? "Uploading…" : "Add photos"}
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={uploading} onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
            </label>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">The first photo is the cover. Up to 8 photos; they&apos;re resized automatically.</p>
        {uploadError && <p className="mt-2 text-sm text-red-700">{uploadError}</p>}
      </section>

      <section className="grid gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <h2 className="text-lg font-bold text-earth-900 md:col-span-2">Details</h2>
        <label className="md:col-span-2"><span className={label}>Name *</span>
          <input name="name" required maxLength={120} defaultValue={product?.name} className={field} />
        </label>
        <label><span className={label}>Category *</span>
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label><span className={label}>Scientific name</span>
          <input name="scientificName" defaultValue={product?.scientific_name ?? ""} placeholder="e.g. Crassula ovata" className={field} />
        </label>
        <label className="md:col-span-2"><span className={label}>Description *</span>
          <textarea name="description" required maxLength={2000} rows={4} defaultValue={product?.description} className={field} />
        </label>
        <label><span className={label}>Selling price (₹) *</span>
          <input name="currentPrice" type="number" required min={0} step="1" defaultValue={product?.current_price} className={field} />
        </label>
        <label><span className={label}>Original price / MRP (₹)</span>
          <input name="originalPrice" type="number" min={0} step="1" defaultValue={product?.original_price ?? ""} placeholder="Shown struck through" className={field} />
        </label>
        <label><span className={label}>Stock *</span>
          <input name="stock" type="number" required min={0} step="1" defaultValue={product?.stock ?? 1} className={field} />
        </label>
        <label><span className={label}>Tags</span>
          <input name="tags" defaultValue={product?.tags.join(", ")} placeholder="Indoor, Bonsai, Tabletop" className={field} />
        </label>
        {attributesShown.map((key) => (
          <label key={key}><span className={label}>{attributeLabels[key]}</span>
            <select name={key} defaultValue={product?.[key] ?? ""} className={field}>
              <option value="">—</option>
              {attributeOptions[key].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
      </section>

      <section className="flex flex-wrap items-center gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <label className="flex items-center gap-2"><span className="text-sm font-medium text-gray-700">Visibility</span>
          <select name="status" defaultValue={product?.status ?? "live"} className="rounded-lg border border-gray-300 bg-white px-3 py-2">
            <option value="live">Live in shop</option>
            <option value="draft">Draft (hidden)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" name="bestSeller" defaultChecked={product?.best_seller} className="filter-checkbox" /> Best seller
        </label>
      </section>

      {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={saving || uploading} className="rounded-xl bg-brand-green-700 px-8 py-3 font-bold text-white shadow hover:bg-brand-green-800 disabled:opacity-60">
        {saving ? "Saving…" : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
