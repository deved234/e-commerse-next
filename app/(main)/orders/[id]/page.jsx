import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { CheckCircle, Package, Truck, Home, Clock } from "lucide-react";

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: Home,
};

export default async function OrderDetailPage({ params, searchParams }) {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();
  const { id } = await params;
  const { success } = await searchParams;

  let order;
  try {
    order = await Order.findById(id)
      .populate("items.product", "name images")
      .lean();
  } catch {
    notFound();
  }

  if (!order) notFound();

  const isOwner = order.user?.toString() === session.user.id;
  const isAdmin = session.user.role === "admin";
  if (!isOwner && !isAdmin) redirect("/orders");

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-8 text-emerald-400">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold">Order placed successfully!</p>
              <p className="text-sm text-emerald-400/70">
                You'll receive a confirmation email shortly.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">
              Order #{order._id.toString().slice(-8).toUpperCase()}
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/orders"
            className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
          >
            ← All Orders
          </Link>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold mb-6">Order Progress</h2>
            <div className="flex items-center">
              {STATUS_STEPS.map((status, index) => {
                const Icon = STATUS_ICONS[status];
                const done = index <= currentStep;
                const active = index === currentStep;
                return (
                  <div key={status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          done
                            ? "bg-amber-400 border-amber-400 text-slate-900"
                            : "bg-slate-800 border-slate-700 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <p
                        className={`text-xs mt-2 font-medium capitalize hidden sm:block ${
                          active
                            ? "text-amber-400"
                            : done
                              ? "text-slate-300"
                              : "text-slate-600"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 transition-colors ${
                          index < currentStep ? "bg-amber-400" : "bg-slate-700"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-6 text-rose-400 font-medium">
            ✗ This order has been cancelled
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Shipping Address
            </h3>
            <p className="text-white font-medium">
              {order.shippingAddress?.street}
            </p>
            <p className="text-slate-400 text-sm">
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </p>
            <p className="text-slate-400 text-sm">
              {order.shippingAddress?.country} {order.shippingAddress?.zipCode}
            </p>
          </div>

          {/* Payment */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Payment Info
            </h3>
            <p className="text-white font-medium capitalize">
              {order.paymentMethod?.replace(/_/g, " ")}
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                order.paymentStatus === "paid"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {order.paymentStatus === "paid"
                ? "✓ Payment Confirmed"
                : "⏳ Payment Pending"}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  {item.image || item.product?.images?.[0] ? (
                    <Image
                      src={item.image || item.product.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.name}</p>
                  <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="text-amber-400 font-bold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-slate-800 mt-5 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Shipping</span>
              <span
                className={
                  order.shippingCost === 0 ? "text-emerald-400" : "text-white"
                }
              >
                {order.shippingCost === 0
                  ? "FREE"
                  : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-slate-800">
              <span className="text-white">Total</span>
              <span className="text-amber-400 text-xl">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
