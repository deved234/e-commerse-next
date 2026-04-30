"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "sonner";

export default function SellerProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
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

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  "Product",
                  "Category",
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
                      <p className="text-white font-medium text-sm line-clamp-1 max-w-[160px]">
                        {product.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {product.category?.name}
                  </td>
                  <td className="px-5 py-4 text-amber-400 font-bold text-sm">
                    {formatPrice(product.price)}
                  </td>
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
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {product.isActive ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/seller/products/${product._id}/edit`}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() =>
                          toggleActive(product._id, product.isActive)
                        }
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      >
                        {product.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
