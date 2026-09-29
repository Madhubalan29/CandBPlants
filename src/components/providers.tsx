"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface CartItem {
  id: number;
  name: string;
  href: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "quantity">) => void;
  changeQuantity: (id: number, delta: number) => void;
  notify: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "candb_cart";

interface Toast {
  id: number;
  message: string;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const loaded = useRef(false);
  const toastId = useRef(0);

  // Restore the cart after hydration so server and client render the same markup.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const notify = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      if (item.stock <= 0) return;
      const existing = items.find((i) => i.id === item.id);
      if (existing && existing.quantity >= item.stock) return notify("Cannot add more than available stock.");
      setItems((prev) =>
        existing
          ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev, { ...item, quantity: 1 }],
      );
      notify(`Added ${item.name} to cart`);
    },
    [items, notify],
  );

  const changeQuantity = useCallback(
    (id: number, delta: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const quantity = item.quantity + delta;
      if (quantity > item.stock) return notify("Limit reached (max stock).");
      setItems((prev) =>
        quantity <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
    },
    [items, notify],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      isOpen,
      setOpen,
      add,
      changeQuantity,
      notify,
    }),
    [items, isOpen, add, changeQuantity, notify],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in rounded-lg bg-brand-green-900 px-6 py-3 text-white shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}
