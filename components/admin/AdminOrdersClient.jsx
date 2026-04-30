"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "sonner";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS = {
  pending: "bg-slate-700 text-slate-300",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-amber-500/20 text-amber-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-rose-500/20 text-rose-400",
};

export default function AdminOrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = orders.filter((o) => {
    const matchSearch = o._id.toString().includes(search);
    const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderStatus: newStatus,
        note: `Status updated to ${newStatus}`,
      }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o,
        ),
      );
      toast.success("Order status updated");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 rounded-xl py-2.5 pl-4 pr-8 text-sm outline-none"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  "Order ID",
                  "Date",
                  "Items",
                  "Payment",
                  "Status",
                  "Total",
                  "Update",
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
              {filtered.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-amber-400 text-sm">
                    #{order._id.toString().slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-slate-300 text-sm">
                    {order.items?.length} items
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm capitalize">
                    {order.paymentMethod?.replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.orderStatus]}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-amber-400 font-bold text-sm">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 rounded-lg py-1.5 pl-3 pr-7 text-xs outline-none cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-10">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
}
