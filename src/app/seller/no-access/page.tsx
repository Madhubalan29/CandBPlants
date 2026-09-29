import Link from "next/link";

export default function NoAccessPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-3 font-serif text-3xl font-bold text-brand-green-900">No seller access</h1>
      <p className="mx-auto mb-8 max-w-md text-gray-600">
        Your account isn&apos;t on the C&amp;B team yet. Ask the shop admin to add your Google email address, then sign in again.
      </p>
      <Link href="/" className="rounded-full bg-brand-green-700 px-6 py-3 font-semibold text-white hover:bg-brand-green-800">Back to the shop</Link>
    </div>
  );
}
