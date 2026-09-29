"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/seller/actions";

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Delete “${name}” permanently? This also removes its photos and reviews.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
        <Trash2 size={16} /> Delete
      </button>
    </form>
  );
}
