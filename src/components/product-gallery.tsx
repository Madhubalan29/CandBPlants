"use client";

import Image from "next/image";
import { useState } from "react";
import { Leaf } from "lucide-react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-2xl bg-brand-green-50 text-brand-green-700">
        <Leaf size={64} />
        <span className="font-medium">Photo coming soon</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50">
        <Image src={images[active]} alt={alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button key={src} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === active}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? "border-brand-green-500" : "border-gray-200 hover:border-brand-green-500"}`}>
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
