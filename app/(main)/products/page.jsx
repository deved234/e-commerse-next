"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/product/ProductCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Package,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "ratings.average-desc", label: "Top Rated" },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    featured: searchParams.get("featured") || "",
    page: 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const res = fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt",
      order: "desc",
      featured: "",
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.featured;

  const handleSortChange = (val) => {
    const [sort, order] = val.split("-");
    setFilters((prev) => ({ ...prev, sort, order, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">All Products</h1>
              <p className="text-slate-400 mt-1 text-sm">
                {pagination.total > 0
                  ? `${pagination.total} products found`
                  : "Discover our collection"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter("search", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  filtersOpen || hasActiveFilters
                    ? "bg-amber-400 border-amber-400 text-slate-900"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-4 h-4 bg-slate-900 text-amber-400 text-xs rounded-full flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 rounded-xl py-2.5 pl-3 pr-8 text-sm outline-none cursor-pointer hover:border-slate-600 transition-colors"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {filtersOpen && (
            <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl py-2.5 px-3 text-sm outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 px-3 outline-none transition-colors text-sm"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 px-3 outline-none transition-colors text-sm"
                />
              </div>

              {/* Featured */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
                  Type
                </label>
                <select
                  value={filters.featured}
                  onChange={(e) => updateFilter("featured", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-xl py-2.5 px-3 text-sm outline-none"
                >
                  <option value="">All Products</option>
                  <option value="true">Featured Only</option>
                </select>
              </div>

              {hasActiveFilters && (
                <div className="col-span-full flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-sm transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your filters or search query"
            action={
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={filters.page <= 1}
                  onClick={() =>
                    setFilters((p) => ({ ...p, page: p.page - 1 }))
                  }
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>

                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      filters.page === p
                        ? "bg-amber-400 text-slate-900 font-bold"
                        : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={filters.page >= pagination.totalPages}
                  onClick={() =>
                    setFilters((p) => ({ ...p, page: p.page + 1 }))
                  }
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
