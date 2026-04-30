import connectDB from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import {
  Users, Package, ShoppingCart, DollarSign,
  TrendingUp, ArrowUpRight, Clock,
} from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

async function getStats() {
  await connectDB();
  const [
    totalUsers, totalProducts, totalOrders,
    revenueData, recentOrders, pendingOrders,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    Order.countDocuments({ orderStatus: "pending" }),
  ]);

  return {
    totalUsers, totalProducts, totalOrders,
    revenue: revenueData[0]?.total || 0,
    recentOrders,
    pendingOrders,
  };
}

const STATUS_COLORS = {
  pending:    "bg-slate-700 text-slate-300",
  confirmed:  "bg-blue-500/20 text-blue-400",
  processing: "bg-amber-500/20 text-amber-400",
  shipped:    "bg-purple-500/20 text-purple-400",
  delivered:  "bg-emerald-500/20 text-emerald-400",
  cancelled:  "bg-rose-500/20 text-rose-400",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      desc: "From paid orders",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      desc: `${stats.pendingOrders} pending`,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      desc: "Active listings",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      desc: "Registered accounts",
    },
  ];

  return (
    <div className="text-white space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ title, value, icon: Icon, color, bg, desc }) => (
          <div
            key={title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-white font-medium text-sm mt-1">{title}</p>
            <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Recent Orders
          </h2>
          <a href="/admin/orders" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
            View All →
          </a>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-slate-500 text-center py-10 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-800">
                  {["Order ID", "Date", "Payment", "Status", "Total"].map((h) => (
                    <th key={h} className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <a
                         href={`/admin/orders/${order._id}`}
                        className="text-amber-400 hover:text-amber-300 font-mono text-sm transition-colors"
                      >
                        #{order._id.toString().slice(-8).toUpperCase()}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm capitalize">
                      {order.paymentMethod?.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-amber-400 font-bold text-sm">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}