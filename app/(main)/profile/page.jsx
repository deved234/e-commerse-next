"use client";
import { useTranslation } from "@/lib/TranslationContext";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", addresses: [] });
  const { t } = useTranslation();


  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((d) => {
        setForm({
          name: d.user?.name || "",
          phone: d.user?.phone || "",
          addresses: d.user?.addresses || [],
        });
        setLoading(false);
      });
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      await update({ name: form.name });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const addAddress = () => {
    setForm((p) => ({
      ...p,
      addresses: [
        ...p.addresses,
        {
          label: "Home",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Egypt",
          isDefault: p.addresses.length === 0,
        },
      ],
    }));
  };

  const removeAddress = (i) => {
    setForm((p) => ({
      ...p,
      addresses: p.addresses.filter((_, idx) => idx !== i),
    }));
  };

  const updateAddress = (i, key, val) => {
    setForm((p) => ({
      ...p,
      addresses: p.addresses.map((a, idx) =>
        idx === i ? { ...a, [key]: val } : a,
      ),
    }));
  };

  const inputClass =
    "w-full bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 rounded-xl py-3 px-4 outline-none transition-colors text-sm";
  const labelClass =
    "text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1.5";

  if (loading) return <LoadingSpinner size="lg" className="min-h-screen" />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">{t("profile.title")}</h1>
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              {t("profile.saved")}!
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-amber-400/10 border-2 border-amber-400/30 rounded-full flex items-center justify-center text-amber-400 text-3xl font-black">
                {form.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-xl">{form.name}</p>
                <p className="text-slate-400 text-sm">{session?.user?.email}</p>
                <p className="text-amber-400 text-xs font-medium capitalize mt-1">
                  {session?.user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              {t("profile.personalInfo")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("profile.fullName")}</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  value={session?.user?.email}
                  disabled
                  className={`${inputClass} opacity-50 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>{t("profile.phone")}</label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="+20 100 000 0000"
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                {t("profile.savedAddresses")}
              </h2>
              <button
                onClick={addAddress}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> {t("profile.addAddress")}
              </button>
            </div>

            {form.addresses.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">
                {t("profile.noAddresses")}
              </p>
            )}

            {form.addresses.map((addr, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <select
                    value={addr.label}
                    onChange={(e) => updateAddress(i, "label", e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-1.5 text-sm outline-none"
                  >
                    {["Home", "Work", "Other"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeAddress(i)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      key: "street",
                      placeholder: "Street Address",
                      span: true,
                    },
                    { key: "city", placeholder: "City" },
                    { key: "state", placeholder: "State" },
                    { key: "zipCode", placeholder: "ZIP Code" },
                    { key: "country", placeholder: "Country" },
                  ].map(({ key, placeholder, span }) => (
                    <input
                      key={key}
                      value={addr[key]}
                      onChange={(e) => updateAddress(i, key, e.target.value)}
                      placeholder={placeholder}
                      className={`${inputClass} ${span ? "sm:col-span-2" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? t("profile.saving") : t("profile.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
