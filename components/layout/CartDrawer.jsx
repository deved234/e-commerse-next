"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-900 border-l border-slate-800 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <h2 className="text-white font-semibold">
              Cart{" "}
              <span className="text-slate-400 font-normal text-sm">
                ({items.length})
              </span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-slate-600" />
              </div>
              <div>
                <p className="text-white font-medium">Your cart is empty</p>
                <p className="text-slate-400 text-sm mt-1">
                  Add some products to get started
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-4 py-2 bg-amber-400 text-slate-900 font-semibold text-sm rounded-lg hover:bg-amber-300 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 bg-slate-800/50 rounded-xl p-3"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-700">
                  {item.images?.[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {item.name}
                  </p>
                  <p className="text-amber-400 text-sm font-bold mt-0.5">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-md flex items-center justify-center text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-md flex items-center justify-center text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item._id, item.name)}
                      className="ml-auto p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white font-bold text-lg">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="flex items-center justify-center w-full py-2.5 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-medium rounded-xl transition-colors text-sm"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
