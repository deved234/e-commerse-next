import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

async function getFeaturedProducts() {
  await connectDB();
  return Product.find({ isActive: true, isFeatured: true })
    .populate("category", "name slug")
    .limit(8)
    .lean();
}

async function getCategories() {
  await connectDB();
  return Category.find({ isActive: true }).sort({ order: 1 }).limit(6).lean();
}

async function getNewArrivals() {
  await connectDB();
  return Product.find({ isActive: true })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
}

export default async function HomePage() {
  const [featured, categories, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getNewArrivals(),
  ]);

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over EGP 500" },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "100% protected transactions",
    },
    { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <div className="text-white">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/3 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(251,191,36,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251,191,36,0.5) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-sm font-medium">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                New Arrivals Every Week
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                Shop{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Smarter
                </span>
                <br />
                Live Better
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                Discover thousands of products at unbeatable prices. Fast
                delivery, easy returns, and secure payments — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-400/20 hover:-translate-y-0.5"
                >
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-600 text-white font-semibold rounded-xl transition-all hover:bg-slate-800"
                >
                  View Featured
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4 border-t border-slate-800">
                {[
                  { value: "50K+", label: "Products" },
                  { value: "100K+", label: "Customers" },
                  { value: "4.9★", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-amber-400">
                      {stat.value}
                    </p>
                    <p className="text-slate-500 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Floating Cards */}
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute top-8 right-8 w-56 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-4 shadow-xl">
                <div className="w-full h-32 bg-slate-700 rounded-xl mb-3 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent" />
                </div>
                <p className="text-white font-semibold text-sm">
                  Premium Headphones
                </p>
                <p className="text-amber-400 font-bold mt-1">EGP 1,299</p>
              </div>

              <div className="absolute top-48 left-0 w-48 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">
                      Order Shipped
                    </p>
                    <p className="text-slate-400 text-xs">2 mins ago</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-amber-400 rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-16 right-12 w-52 bg-amber-400 rounded-2xl p-4 shadow-xl shadow-amber-400/20">
                <p className="text-slate-900 font-black text-2xl">-40%</p>
                <p className="text-slate-900/70 text-sm font-medium">
                  Flash Sale Today
                </p>
                <p className="text-slate-900 font-bold text-sm mt-2">
                  Limited Time Offer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-slate-900 border-y border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-slate-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section className="py-16 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black">Shop by Category</h2>
                <p className="text-slate-400 mt-1">
                  Find exactly what you're looking for
                </p>
              </div>
              <Link
                href="/products"
                className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                All Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat._id}`}
                  className="group flex flex-col items-center gap-3 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/30 rounded-2xl transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 bg-slate-800 group-hover:bg-amber-400/10 rounded-xl flex items-center justify-center transition-colors overflow-hidden relative">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🛍️</span>
                    )}
                  </div>
                  <span className="text-slate-300 group-hover:text-white text-xs font-medium transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED PRODUCTS ===== */}
      {featured.length > 0 && (
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black">Featured Products</h2>
                <p className="text-slate-400 mt-1">Hand-picked just for you</p>
              </div>
              <Link
                href="/products?featured=true"
                className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== BANNER ===== */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-black/10 rounded-full translate-y-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-slate-900/70 font-semibold text-sm uppercase tracking-wider">
                  Limited Time Offer
                </p>
                <h3 className="text-slate-900 font-black text-4xl mt-1">
                  Get 20% Off
                </h3>
                <p className="text-slate-900/80 mt-2">
                  On your first order. Use code{" "}
                  <span className="font-black bg-slate-900/20 px-2 py-0.5 rounded">
                    WELCOME20
                  </span>
                </p>
              </div>
              <Link
                href="/products"
                className="shrink-0 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black">New Arrivals</h2>
                <p className="text-slate-400 mt-1">Fresh drops, just landed</p>
              </div>
              <Link
                href="/products?sort=createdAt&order=desc"
                className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                See All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
