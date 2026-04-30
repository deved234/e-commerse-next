"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ProductForm({ initialData, productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
    category: "",
    tags: "",
    images: [],
    isFeatured: false,
    ...initialData,
    price: initialData?.price || "",
    stock: initialData?.stock || "",
    tags: initialData?.tags?.join(", ") || "",
    category: initialData?.category?._id || initialData?.category || "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const addImage = () => {
    if (imageUrl.trim()) {
      setForm((p) => ({ ...p, images: [...p.images, imageUrl.trim()] }));
      setImageUrl("");
    }
  };

  const removeImage = (i) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock: parseInt(form.stock),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const method = productId ? "PUT" : "POST";
    const url = productId ? `/api/products/${productId}` : "/api/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      toast.success(productId ? "Product updated!" : "Product created!");
      router.push("/seller/products");
    } else {
      const data = await res.json();
      toast.error(data.error || "Something went wrong");
    }
  };

  const inputClass =
    "w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 px-4 outline-none transition-colors text-sm";
  const labelClass =
    "text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-bold">Basic Information</h2>
        <div>
          <label className={labelClass}>Product Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="iPhone 16 Pro Max"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            required
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Detailed product description..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
            className={inputClass}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-bold">Pricing & Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Price (EGP) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="1299"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Compare Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.comparePrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, comparePrice: e.target.value }))
              }
              placeholder="1599 (original)"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock *</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm((p) => ({ ...p, stock: e.target.value }))
              }
              placeholder="50"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-bold">Product Images</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL..."
            className={`${inputClass} flex-1`}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addImage())
            }
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 group"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-bold">Additional Info</h2>
        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="electronics, wireless, audio"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() =>
              setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))
            }
            className={`w-11 h-6 rounded-full transition-colors relative ${form.isFeatured ? "bg-amber-400" : "bg-slate-700"}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.isFeatured ? "translate-x-6" : "translate-x-1"}`}
            />
          </div>
          <span className="text-slate-300 text-sm font-medium">
            Feature this product on homepage
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/seller/products")}
          className="flex-1 py-4 border border-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
        >
          {saving && <Loader2 className="w-5 h-5 animate-spin" />}
          {saving
            ? "Saving..."
            : productId
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
