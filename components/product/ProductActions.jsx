"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";

export default function ProductActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm font-medium">Quantity:</span>
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-white font-bold w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => addItem(product, quantity)}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 disabled:text-slate-500 font-bold rounded-xl transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          onClick={() => toggleItem(product)}
          className={`w-12 h-12 flex items-center justify-center border rounded-xl transition-colors ${
            inWishlist
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "border-slate-700 text-slate-400 hover:border-rose-500/30 hover:text-rose-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${inWishlist ? "fill-rose-400" : ""}`} />
        </button>
      </div>
    </div>
  );
}
