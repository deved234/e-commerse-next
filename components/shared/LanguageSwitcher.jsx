"use client";

import { useTranslation } from "@/lib/TranslationContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, switchLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
      <Globe className="w-4 h-4 text-slate-400 ml-1" />
      <button
        onClick={() => switchLocale("en")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
          locale === "en"
            ? "bg-amber-400 text-slate-900"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("ar")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
          locale === "ar"
            ? "bg-amber-400 text-slate-900"
            : "text-slate-400 hover:text-white"
        }`}
      >
        AR
      </button>
    </div>
  );
}
