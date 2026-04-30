import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ProductForm from "@/components/seller/ProductForm";

export default async function EditProductPage({ params }) {
  const session = await auth();
  const { id } = await params;

  await connectDB();
  const product = await Product.findById(id).lean();

  if (!product) notFound();
  if (
    product.seller.toString() !== session.user.id &&
    session.user.role !== "admin"
  ) {
    redirect("/seller/products");
  }

  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl font-black">Edit Product</h1>
      <ProductForm initialData={product} productId={id} />
    </div>
  );
}
