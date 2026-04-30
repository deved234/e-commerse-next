import { notFound } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import ProductActions from "@/components/product/ProductActions";
import StarRating from "@/components/shared/StarRating";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/utils/formatPrice";
import { Shield, Truck, RefreshCw, Package } from "lucide-react";

async function getProduct(id) {
  await connectDB();
  try {
    return await Product.findById(id)
      .populate("category", "name slug")
      .populate("seller", "name")
      .lean();
  } catch {
    return null;
  }
}

async function getReviews(productId) {
  await connectDB();
  return Review.find({ product: productId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
}

async function getRelated(product) {
  await connectDB();
  return Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .populate("category", "name slug")
    .limit(4)
    .lean();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `${product.name} | ShopZone` : "Product Not Found",
    description: product?.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || !product.isActive) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(id),
    getRelated(product),
  ]);

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-amber-400 transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/products"
            className="hover:text-amber-400 transition-colors"
          >
            Products
          </a>
          <span>/</span>
          <a
            href={`/products?category=${product.category?._id}`}
            className="hover:text-amber-400 transition-colors"
          >
            {product.category?.name}
          </a>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700">
                  <Package className="w-24 h-24" />
                </div>
              )}
              {discount && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white text-sm font-bold rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-amber-400 text-sm font-medium">
                {product.category?.name}
              </p>
              <h1 className="text-3xl font-black mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating
                rating={product.ratings?.average || 0}
                count={product.ratings?.count}
                size="md"
              />
              {product.ratings?.count > 0 && (
                <span className="text-slate-400 text-sm">
                  {product.ratings.average} out of 5
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-amber-400">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-slate-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {discount && (
                <span className="text-rose-400 font-bold text-sm">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-400" : "bg-rose-400"}`}
              />
              <span
                className={`text-sm font-medium ${product.stock > 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} left)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Client Actions Component */}
            <ProductActions product={product} />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              {[
                { icon: Truck, text: "Free Shipping over EGP 500" },
                { icon: Shield, text: "Secure Payment" },
                { icon: RefreshCw, text: "30-day Returns" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <Icon className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-400 text-xs">{text}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-sm">
              Sold by:{" "}
              <span className="text-slate-300">{product.seller?.name}</span>
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-black mb-6">
            Customer Reviews{" "}
            <span className="text-slate-500 font-normal text-lg">
              ({reviews.length})
            </span>
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                        {review.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {review.user?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} size="sm" />
                          {review.isVerifiedPurchase && (
                            <span className="text-emerald-400 text-xs font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs shrink-0">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
