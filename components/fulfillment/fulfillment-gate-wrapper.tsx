"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";
import { FulfillmentGate } from "./fulfillment-gate";

export function FulfillmentGateWrapper({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  return (
    <>
      {children}
      <FulfillmentGate locale={locale} />
    </>
  );
}
