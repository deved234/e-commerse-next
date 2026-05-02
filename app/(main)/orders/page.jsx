import { useTranslation } from "@/lib/TranslationContext";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import OrdersClient from "@/components/order/OrdersClient";

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();
  const orders = await Order.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean()
    .then((docs) => JSON.parse(JSON.stringify(docs)));

  return <OrdersClient orders={orders} />;
}