"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";
import { usePathname } from "next/navigation";
import { FulfillmentGate } from "./fulfillment-gate";

export function FulfillmentGateWrapper({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdmin && <FulfillmentGate locale={locale} />}
    </>
  );
}
