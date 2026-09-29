"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Leaf } from "lucide-react";

// Cross-fades through a product's photos while the card is on screen. One timer per card,
// cleared on unmount, so re-filtering the grid doesn't pile up intervals.
export function CardImages({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || images.length < 2) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [visible, images.length]);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-green-50 text-brand-green-700">
        <Leaf size={40} />
        <span className="px-4 text-center text-sm font-medium">Photo coming soon</span>
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
