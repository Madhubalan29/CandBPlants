"use client";

import { useActionState } from "react";
import { submitReview, type ReviewState } from "@/app/actions/reviews";
import { useAuth } from "./auth-menu";
import { GoogleSignInButton } from "./google-sign-in-button";

export function ReviewForm({ productId, path }: { productId: number; path: string }) {
  const { user } = useAuth();
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, {});
  const field = "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-green-500 focus:outline-none";

  if (!user) {
    return (
      <>
        <p className="mb-4 text-sm text-gray-600">Sign in to share how your plant is doing.</p>
        <GoogleSignInButton next={path} label="Sign in with Google to review" />
      </>
    );
  }

  if (state.ok) return <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">Thanks! Your review has been posted.</p>;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="path" value={path} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Rating</span>
        <select name="rating" required defaultValue="5" className={`${field} bg-white`}>
          <option value="5">5 Stars - Excellent</option>
          <option value="4">4 Stars - Very Good</option>
          <option value="3">3 Stars - Average</option>
          <option value="2">2 Stars - Poor</option>
          <option value="1">1 Star - Terrible</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Review</span>
        <textarea name="comment" required minLength={3} maxLength={1000} rows={3} className={field} />
      </label>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-lg bg-brand-green-700 px-6 py-2 font-bold text-white transition hover:bg-brand-green-800 disabled:opacity-60">
        {pending ? "Posting…" : "Submit Review"}
      </button>
    </form>
  );
}
