"use client";

import { useState } from "react";
import { Search, Shield, ShieldOff, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const ROLE_COLORS = {
  admin: "bg-amber-400/20 text-amber-400",
  seller: "bg-blue-400/20 text-blue-400",
  customer: "bg-slate-700 text-slate-300",
};

export default function AdminUsersClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const toggleActive = async (userId, currentStatus) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u,
        ),
      );
      toast.success(currentStatus ? "User restricted" : "User activated");
    }
  };

  const changeRole = async (userId, newRole) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success("Role updated");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 rounded-xl py-2.5 pl-4 pr-8 text-sm outline-none"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
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
              {filtered.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {user.name}
                        </p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${ROLE_COLORS[user.role]}`}
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Restricted"}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-slate-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(user._id, user.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isActive
                          ? "text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
                          : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                      }`}
                      title={user.isActive ? "Restrict user" : "Activate user"}
                    >
                      {user.isActive ? (
                        <ShieldOff className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-10">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}
