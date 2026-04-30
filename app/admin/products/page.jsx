import connectDB from "@/lib/db";
import Product from "@/models/Product";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find()
    .populate("category", "name")
    .populate("seller", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-black">Products</h1>
        <p className="text-slate-400 mt-1">{products.length} total products</p>
      </div>
      <AdminProductsClient initialProducts={products} />
    </div>
  );
}
