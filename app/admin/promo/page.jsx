"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";

export default function AdminPromoPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
  });

  const fetchPromos = async () => {
    const res = await fetch("/api/admin/promo");
    const data = await res.json();
    setPromos(data.promos || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Promo code created!");
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxUses: "",
        expiresAt: "",
      });
      fetchPromos();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this promo code?")) return;
    const res = await fetch(`/api/admin/promo?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      fetchPromos();
    }
  };

  const inputClass =
    "w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 px-4 outline-none transition-colors text-sm";
  const labelClass =
    "text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1.5";

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-black">Promo Codes</h1>
        <p className="text-slate-400 mt-1">Manage discount codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-5 flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            Add Promo Code
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Code *</label>
              <input
                required
                value={form.code}
                onChange={(e) =>
                  setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                }
                placeholder="WELCOME20"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Discount Type *</label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discountType: e.target.value }))
                }
                className={inputClass}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (EGP)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Discount Value *</label>
              <input
                required
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discountValue: e.target.value }))
                }
                placeholder={form.discountType === "percentage" ? "20" : "50"}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Min Order Amount</label>
              <input
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, minOrderAmount: e.target.value }))
                }
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Max Uses (leave empty = unlimited)
              </label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxUses: e.target.value }))
                }
                placeholder="100"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Expires At</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, expiresAt: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Code
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          ) : promos.length === 0 ? (
            <p className="text-center text-slate-500 py-20">
              No promo codes yet
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {[
                    "Code",
                    "Discount",
                    "Min Order",
                    "Uses",
                    "Expires",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {promos.map((promo) => (
                  <tr
                    key={promo._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-amber-400 font-bold text-sm">
                      {promo.code}
                    </td>
                    <td className="px-5 py-4 text-white text-sm">
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}%`
                        : `EGP ${promo.discountValue}`}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      EGP {promo.minOrderAmount}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {promo.usedCount}/{promo.maxUses || "∞"}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {promo.expiresAt
                        ? new Date(promo.expiresAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
