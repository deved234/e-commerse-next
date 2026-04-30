"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import {
  CreditCard,
  Truck,
  Wallet,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const PAYMENT_METHODS = [
  {
    id: "stripe",
    label: "Credit / Debit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard",
  },
  {
    id: "cash_on_delivery",
    label: "Cash on Delivery",
    icon: Truck,
    desc: "Pay when delivered",
  },
  { id: "paypal", label: "PayPal", icon: DollarSign, desc: "Pay via PayPal" },
  { id: "wallet", label: "Wallet", icon: Wallet, desc: "Use your balance" },
];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingCost;

  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Egypt",
    notes: "",
  });

  const updateForm = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
          shippingAddress: {
            street: form.street,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            country: form.country,
          },
          paymentMethod,
          guestEmail: !session ? form.email : undefined,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/orders/${data.order._id}?success=true`);
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const inputClass =
    "w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 px-4 outline-none transition-colors text-sm";

  const labelClass =
    "text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1.5";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10">
          {["Shipping Info", "Payment", "Review"].map((s, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-amber-400 text-slate-900"
                          : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {done ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      active ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < 2 && (
                  <div className="flex-1 h-px bg-slate-800 w-8 sm:w-16" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Steps */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="+20 100 000 0000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      value={form.country}
                      onChange={(e) => updateForm("country", e.target.value)}
                      placeholder="Egypt"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Street Address</label>
                    <input
                      value={form.street}
                      onChange={(e) => updateForm("street", e.target.value)}
                      placeholder="123 Main St, Apt 4B"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      placeholder="Cairo"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State / Governorate</label>
                    <input
                      value={form.state}
                      onChange={(e) => updateForm("state", e.target.value)}
                      placeholder="Cairo"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input
                      value={form.zipCode}
                      onChange={(e) => updateForm("zipCode", e.target.value)}
                      placeholder="11511"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Order Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      placeholder="Any special instructions..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={
                    !form.name || !form.email || !form.street || !form.city
                  }
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const selected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          selected
                            ? "border-amber-400 bg-amber-400/5"
                            : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? "bg-amber-400 text-slate-900" : "bg-slate-700 text-slate-400"}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-sm ${selected ? "text-white" : "text-slate-300"}`}
                          >
                            {method.label}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {method.desc}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-amber-400" : "border-slate-600"}`}
                        >
                          {selected && (
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Card fields placeholder */}
                {paymentMethod === "stripe" && (
                  <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 text-sm">
                    💳 Stripe card form will be integrated here using{" "}
                    <code>@stripe/react-stripe-js</code>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border border-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors hover:bg-slate-800"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-colors"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-xl font-bold">Review Your Order</h2>

                {/* Shipping Summary */}
                <div className="bg-slate-800/50 rounded-xl p-4 space-y-1">
                  <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Shipping To
                  </p>
                  <p className="text-white text-sm font-medium">{form.name}</p>
                  <p className="text-slate-400 text-sm">
                    {form.email} · {form.phone}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {form.street}, {form.city}, {form.country}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Payment
                  </p>
                  <p className="text-white text-sm font-medium capitalize">
                    {paymentMethod.replace(/_/g, " ")}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    Items
                  </p>
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
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
                        <p className="text-slate-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-amber-400 font-bold text-sm shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3.5 border border-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors hover:bg-slate-800"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20">
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-slate-400 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span
                    className={
                      shippingCost === 0 ? "text-emerald-400" : "text-white"
                    }
                  >
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-800">
                  <span className="text-white">Total</span>
                  <span className="text-amber-400 text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
