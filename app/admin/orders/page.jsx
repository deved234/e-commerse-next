import connectDB from "@/lib/db";
import Order from "@/models/Order";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean() .then((docs) => JSON.parse(JSON.stringify(docs)));

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-black">Orders</h1>
        <p className="text-slate-400 mt-1">{orders.length} total orders</p>
      </div>
      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
