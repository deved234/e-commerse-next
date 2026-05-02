"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { useTranslation } from "@/lib/TranslationContext";
import EmptyState from "@/components/shared/EmptyState";

const STATUS_STYLES = {
  pending: { bg: "bg-slate-700", text: "text-slate-300" },
  confirmed: { bg: "bg-blue-500/20", text: "text-blue-400" },
  processing: { bg: "bg-amber-500/20", text: "text-amber-400" },
  shipped: { bg: "bg-purple-500/20", text: "text-purple-400" },
  delivered: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  cancelled: { bg: "bg-rose-500/20", text: "text-rose-400" },
};

export default function OrdersClient({ orders }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black mb-8">{t("orders.title")}</h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t("orders.empty")}
            description={t("orders.emptyDesc")}
            action={
              <Link
                href="/products"
                className="px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors"
              >
                {t("cart.browse")}
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const style =
                STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </p>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {order.items?.length} {t("orders.items")} ·{" "}
                        {order.paymentMethod?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-amber-400 font-black text-lg">
                          {formatPrice(order.total)}
                        </p>
                        <p
                          className={`text-xs font-medium ${order.paymentStatus === "paid" ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {order.paymentStatus === "paid"
                            ? t("orders.paid")
                            : t("orders.pending")}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
