"use client";

import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">
            Wishlist{" "}
            <span className="text-slate-500 font-normal text-xl">
              ({items.length})
            </span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-rose-400 hover:text-rose-300 text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products you love to buy them later"
            action={
              <Link
                href="/products"
                className="px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors"
              >
                Discover Products
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
