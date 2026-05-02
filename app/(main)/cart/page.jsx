"use client";
import { useTranslation } from "@/lib/TranslationContext";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Tag,
  Package,
} from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoData, setPromoData] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  const shippingCost = subtotal > 500 ? 0 : 50;
  const discount = promoData?.discountAmount || 0;
  const total = subtotal + shippingCost - discount;
  const { t } = useTranslation();


  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoData(null);

    const res = await fetch("/api/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, orderAmount: subtotal }),
    });

    const data = await res.json();
    setPromoLoading(false);

    if (!res.ok) {
      setPromoError(data.error);
    } else {
      setPromoData(data);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <EmptyState
          icon={ShoppingCart}
          title={t("cart.empty")}
          description="Add some products and come back!"
          action={
            <Link
              href="/products"
              className="px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors"
            >
              {t("cart.browse")}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">
            {t("cart.title")}{" "}
            <span className="text-slate-500 font-normal text-xl">
              ({items.length} items)
            </span>
          </h1>
          <button
            onClick={clearCart}
            className="text-rose-400 hover:text-rose-300 text-sm transition-colors"
          >
            {t("cart.clearAll")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4"
              >
                <Link
                  href={`/products/${item._id}`}
                  className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-800"
                >
                  {item.images?.[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item._id}`}
                        className="text-white font-semibold hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {item.category?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id, item.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-slate-500 text-xs">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm transition-colors mt-2"
            >
              ← {t("cart.continueShopping")}
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                {t("cart.promoCode")}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("cart.enterCode")}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 px-3 outline-none transition-colors text-sm"
                />
                <button
                  onClick={applyPromo}
                  disabled={promoLoading}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors text-sm"
                >
                  {promoLoading ? "..." : t("cart.apply")}
                </button>
              </div>
              {promoError && (
                <p className="text-rose-400 text-xs mt-2">{promoError}</p>
              )}
              {promoData && (
                <p className="text-emerald-400 text-xs mt-2 font-medium">
                  ✓{" "}
                  {promoData.discountType === "percentage"
                    ? `${promoData.discountValue}%`
                    : `EGP ${promoData.discountValue}`}{" "}
                  {t("cart.discount")}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    {t("cart.subtotal")} (
                    {items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t("cart.shipping")}</span>
                  <span
                    className={
                      shippingCost === 0
                        ? "text-emerald-400 font-medium"
                        : "text-white"
                    }
                  >
                    {shippingCost === 0
                      ? ` ${t("cart.free")}`
                      : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-slate-500 text-xs">
                    Add {formatPrice(500 - subtotal)} more for {t("cart.free")}{" "}
                    shipping
                  </p>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">
                      {t("cart.discount")}
                    </span>
                    <span className="text-emerald-400">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-3 flex justify-between">
                  <span className="text-white font-bold">
                    {t("cart.total")}
                  </span>
                  <span className="text-amber-400 font-black text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full mt-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-400/20"
              >
                {t("cart.checkout")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              {[
                "🔒 Secure SSL Checkout",
                "🚚 Fast Delivery",
                "↩️ 30-Day Returns",
              ].map((item) => (
                <p key={item} className="text-slate-400 text-xs py-1.5">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
