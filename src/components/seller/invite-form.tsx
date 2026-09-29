"use client";

import { useActionState } from "react";
import { inviteStaff, type FormState } from "@/app/seller/actions";

export function InviteForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(inviteStaff, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <label className="min-w-64 flex-1">
        <span className="mb-1 block text-sm font-medium text-gray-700">Google email</span>
        <input name="email" type="email" required placeholder="name@gmail.com" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-green-500 focus:outline-none" />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium text-gray-700">Role</span>
        <select name="role" className="rounded-lg border border-gray-300 bg-white px-4 py-2">
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button disabled={pending} className="rounded-lg bg-brand-green-700 px-6 py-2 font-bold text-white hover:bg-brand-green-800 disabled:opacity-60">
        {pending ? "Adding…" : "Add to team"}
      </button>
      {state.error && <p className="w-full text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
