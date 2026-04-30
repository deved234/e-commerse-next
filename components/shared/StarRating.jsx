import { Star } from "lucide-react";

export default function StarRating({
  rating,
  count,
  size = "sm",
  interactive = false,
  onChange,
}) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5" };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${sizes[size]} transition-colors ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-600"
            }`}
          />
        </button>
      ))}
      {count !== undefined && (
        <span className="text-slate-400 text-xs ml-1">({count})</span>
      )}
    </div>
  );
}
