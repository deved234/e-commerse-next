"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Eye, EyeOff, Star, Package } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "sonner";

export default function AdminProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleActive = async (id, current) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !current } : p)),
      );
      toast.success(current ? "Product hidden" : "Product visible");
    }
  };

  const toggleFeatured = async (id, current) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFeatured: !current } : p)),
      );
      toast.success(current ? "Removed from featured" : "Added to featured");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  "Product",
                  "Category",
                  "Seller",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm line-clamp-1 max-w-[180px]">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-slate-500 text-xs">
                            {product.ratings?.average || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {product.category?.name}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {product.seller?.name}
                  </td>
                  <td className="px-5 py-4 text-amber-400 font-bold text-sm">
                    {formatPrice(product.price)}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-medium ${
                        product.stock === 0
                          ? "text-rose-400"
                          : product.stock < 10
                            ? "text-amber-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${
                          product.isActive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {product.isActive ? "Visible" : "Hidden"}
                      </span>
                      {product.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-400 w-fit">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          toggleActive(product._id, product.isActive)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          product.isActive
                            ? "text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
                            : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                        }`}
                        title={product.isActive ? "Hide" : "Show"}
                      >
                        {product.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          toggleFeatured(product._id, product.isFeatured)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          product.isFeatured
                            ? "text-amber-400 hover:bg-amber-400/10"
                            : "text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"
                        }`}
                        title={product.isFeatured ? "Unfeature" : "Feature"}
                      >
                        <Star
                          className={`w-4 h-4 ${product.isFeatured ? "fill-amber-400" : ""}`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-10">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
