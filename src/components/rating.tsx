import { Star } from "lucide-react";

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="flex" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
      ))}
    </span>
  );
}

export function RatingSummary({ average, count }: { average: number; count: number }) {
  if (count === 0) return <span className="w-max rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">No reviews yet</span>;
  return (
    <div className="flex items-center gap-1">
      <Stars value={average} />
      <span className="ml-1 text-xs text-gray-500">({average.toFixed(1)})</span>
    </div>
  );
}
