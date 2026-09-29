import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  return (
    <div className="flex flex-col items-center px-4 py-24 text-center">
      <h1 className="mb-3 font-serif text-4xl font-bold text-brand-green-900">Sign in</h1>
      <p className="mb-8 max-w-sm text-gray-600">Sign in to write reviews, or to manage products if you&apos;re part of the C&amp;B team.</p>
      {error && <p className="mb-6 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">Sign-in didn&apos;t complete. Please try again.</p>}
      <GoogleSignInButton next={next?.startsWith("/") ? next : "/"} />
    </div>
  );
}
