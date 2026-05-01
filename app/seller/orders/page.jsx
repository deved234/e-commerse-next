import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { formatPrice } from "@/utils/formatPrice";

const STATUS_COLORS = {
  pending: "bg-slate-700 text-slate-300",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-amber-500/20 text-amber-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-rose-500/20 text-rose-400",
};

export default async function SellerOrdersPage() {
  const session = await auth();
  await connectDB();

  // نجيب الـ products بتاعت الـ seller
  const sellerProductIds = await Product.find({
    seller: session.user.id,
  }).distinct("_id");

  // نجيب الـ orders اللي فيها منتجات للـ seller ده
  const orders = await Order.find({
    "items.product": { $in: sellerProductIds },
  })
    .sort({ createdAt: -1 })
    .lean()

    .then((docs) => JSON.parse(JSON.stringify(docs)));

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-black">My Orders</h1>
        <p className="text-slate-400 mt-1">
          {orders.length} orders containing your products
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-500">
          No orders yet for your products
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Order ID", "Date", "Payment", "Status", "Total"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((order) => (
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
                    <td className="px-5 py-4 text-slate-300 text-sm capitalize">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
