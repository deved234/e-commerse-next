"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/utils/generateSlug";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/categories/${editId}` : "/api/categories";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: generateSlug(form.name) }),
    });

    setSaving(false);
    if (res.ok) {
      toast.success(editId ? "Category updated" : "Category created");
      setForm({ name: "", description: "", image: "" });
      setEditId(null);
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Category deleted");
      fetchCategories();
    }
  };

  const inputClass =
    "w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 px-4 outline-none transition-colors text-sm";

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-black">Categories</h1>
        <p className="text-slate-400 mt-1">Manage product categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-5 flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            {editId ? "Edit Category" : "Add Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">
                Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Electronics"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Category description..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">
                Image URL
              </label>
              <input
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Update" : "Create"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", description: "", image: "" });
                  }}
                  className="px-4 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-slate-500 py-20">
              No categories yet
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Name", "Slug", "Actions"].map((h) => (
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
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditId(cat._id);
                            setForm({
                              name: cat.name,
                              description: cat.description || "",
                              image: cat.image || "",
                            });
                          }}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
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
          )}
        </div>
      </div>
    </div>
  );
}
