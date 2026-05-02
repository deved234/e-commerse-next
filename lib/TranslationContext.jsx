"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const TranslationContext = createContext({
  locale: "en",
  switchLocale: () => {},
  t: (key) => key,
});

export function TranslationProvider({ children }) {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") || "en";
    setLocale(saved);
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = saved;
  }, []);

  const switchLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ locale, switchLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
