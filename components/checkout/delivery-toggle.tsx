"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Store } from "@/lib/icons";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/translations";

interface DeliveryToggleProps {
  locale: Locale;
}

export default function DeliveryToggle({ locale }: DeliveryToggleProps) {
  const { deliveryMethod, setDeliveryMethod } = useCartStore();

  return (
    <div className="relative flex bg-gray-100 rounded-xl p-1">
      {(["delivery", "pickup"] as const).map((method) => {
        const isSelected = deliveryMethod === method;
        const Icon = method === "delivery" ? Truck : Store;
        const label = method === "delivery"
          ? (locale === "ar" ? "توصيل" : "Delivery")
          : (locale === "ar" ? "استلام" : "Pickup");

        return (
          <button
            key={method}
            onClick={() => setDeliveryMethod(method)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-colors z-10",
              isSelected ? "text-white" : "text-gray-600 hover:text-gray-900"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="delivery-toggle-bg"
                className="absolute inset-0 rounded-lg bg-[#29ac00]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
