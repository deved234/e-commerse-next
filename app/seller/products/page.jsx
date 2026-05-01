import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import SellerProductsClient from "@/components/seller/SellerProductsClient";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function SellerProductsPage() {
  const session = await auth();
  await connectDB();

  const products = await Product.find({ seller: session.user.id })
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean()
    .then((docs) => JSON.parse(JSON.stringify(docs)));

  return (
    <div className="text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">My Products</h1>
          <p className="text-slate-400 mt-1">
            {products.length} products listed
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>
      <SellerProductsClient initialProducts={products} />
    </div>
  );
}
