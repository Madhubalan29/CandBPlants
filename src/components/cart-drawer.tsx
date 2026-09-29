"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Leaf, Minus, Plus, X } from "lucide-react";
import { formatPrice, site } from "@/lib/site";
import { useCart } from "./providers";
import { WhatsAppIcon } from "./brand-icons";

export function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, changeQuantity, notify } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpen]);

  function checkout() {
    if (items.length === 0) return notify("Your cart is empty!");
    let message = "Hello C & B Potted Plants! 🌱\n\nI would like to place an order:\n\n*Order Summary:*\n";
    for (const item of items) message += `- ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
    message += `\n*Total Amount: ${formatPrice(subtotal)}*\n\nPlease let me know the payment details and delivery timeframe. Thank you!`;
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:w-[400px] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex items-center justify-between border-b bg-brand-green-50 p-6">
          <h2 className="font-serif text-2xl font-bold text-brand-green-900">Your Cart</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-brand-green-700" aria-label="Close cart">
            <X />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {items.length === 0 && <p className="mt-10 text-center text-gray-500">Your cart is empty.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-brand-green-50">
                {item.image ? (
                  <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <Leaf className="absolute inset-0 m-auto text-brand-green-700" />
                )}
              </div>
              <div className="flex-1">
                <Link href={item.href} onClick={() => setOpen(false)} className="mb-1 block text-sm font-bold leading-tight text-earth-900 hover:text-brand-green-700">
                  {item.name}
                </Link>
                <p className="text-sm font-semibold text-brand-green-700">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-white p-1 shadow-sm">
                <button onClick={() => changeQuantity(item.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-200" aria-label={`Decrease ${item.name}`}>
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => changeQuantity(item.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-200" aria-label={`Increase ${item.name}`}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-gray-600">Subtotal</span>
            <span className="text-xl font-bold text-brand-green-900">{formatPrice(subtotal)}</span>
          </div>
          <button onClick={checkout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-700">
            <WhatsAppIcon className="h-5 w-5" /> Order via WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}
