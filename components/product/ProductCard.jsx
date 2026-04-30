"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : null;

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5">
      {/* Image */}
      <Link
        href={`/products/${product._id}`}
        className="block relative aspect-square bg-slate-800 overflow-hidden"
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-medium rounded-full">
              Out of Stock
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-amber-400 text-slate-900 text-xs font-bold rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-800"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${inWishlist ? "text-rose-500 fill-rose-500" : "text-slate-300"}`}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <p className="text-slate-400 text-xs mb-1">
            {product.category?.name}
          </p>
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-xs font-medium">
              {product.ratings.average}
            </span>
            <span className="text-slate-500 text-xs">
              ({product.ratings.count})
            </span>
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-white font-bold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-slate-500 text-xs line-through ml-2">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-8 h-8 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 rounded-lg flex items-center justify-center transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
