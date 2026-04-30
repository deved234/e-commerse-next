"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">
            Check your email!
          </h2>
          <p className="text-slate-400 text-sm">
            We sent a verification link to{" "}
            <span className="text-white">{form.email}</span>. Please verify your
            email to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      icon: User,
      placeholder: "John Doe",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      icon: Mail,
      placeholder: "you@example.com",
    },
    {
      key: "phone",
      label: "Phone (optional)",
      type: "tel",
      icon: Phone,
      placeholder: "+20 100 000 0000",
    },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-1 text-sm">Join ShopZone today</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-6 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="text-slate-300 text-sm font-medium block mb-1.5">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={type}
                  required={key !== "phone"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                />
              </div>
            </div>
          ))}

          {/* Password */}
          {["password", "confirmPassword"].map((key) => (
            <div key={key}>
              <label className="text-slate-300 text-sm font-medium block mb-1.5">
                {key === "password" ? "Password" : "Confirm Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-10 outline-none transition-colors text-sm"
                />
                {key === "confirmPassword" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
