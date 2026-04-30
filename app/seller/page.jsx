import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";

async function getSellerStats(sellerId) {
  await connectDB();
  const [products, orders, revenueData] = await Promise.all([
    Product.countDocuments({ seller: sellerId, isActive: true }),
    Order.countDocuments({
      "items.product": {
        $in: await Product.find({ seller: sellerId }).distinct("_id"),
      },
    }),
    Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $match: { "productDetails.seller": sellerId, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  return {
    products,
    orders,
    revenue: revenueData[0]?.total || 0,
  };
}

export default async function SellerDashboard() {
  const session = await auth();
  const stats = await getSellerStats(session.user.id);

  const cards = [
    {
      title: "My Products",
      value: stats.products,
      icon: Package,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      href: "/seller/products",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      href: "/seller/orders",
    },
    {
      title: "Revenue",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      href: "/seller/orders",
    },
  ];

  return (
    <div className="text-white space-y-8">
      <div>
        <h1 className="text-3xl font-black">Seller Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back, {session.user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(({ title, value, icon: Icon, color, bg, href }) => (
          <Link
            key={title}
            href={href}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-slate-400 text-sm mt-1">{title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/seller/products/new"
            className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-colors text-sm"
          >
            <Package className="w-4 h-4" /> Add New Product
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center gap-2 px-5 py-3 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-medium rounded-xl transition-colors text-sm"
          >
            <ShoppingCart className="w-4 h-4" /> View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
