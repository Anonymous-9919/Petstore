"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Locale } from "./translations";

type LocaleContext = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "ltr" | "rtl";
};

const Context = createContext<LocaleContext>({
  locale: "en",
  setLocale: () => {},
  dir: "ltr",
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ps_locale") as Locale | null;
      if (saved === "en" || saved === "ar") return saved;
    }
    return "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("ps_locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <Context value={{ locale, setLocale, dir: locale === "ar" ? "rtl" : "ltr" }}>
      {children}
    </Context>
  );
}

export function useLocale() {
  return useContext(Context);
}
