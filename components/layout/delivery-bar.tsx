"use client";

import { useCallback } from "react";
import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";

export default function DeliveryBar() {
  const { locale } = useLocale();
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);
  const setSelectedBranch = useCartStore((s) => s.setSelectedBranch);
  const isEnglish = locale === "en";

  const chooseMethod = useCallback((method: "delivery" | "pickup") => {
    setDeliveryMethod(method);
    if (method === "delivery") {
      setSelectedBranch("");
    }
  }, [setDeliveryMethod, setSelectedBranch]);

  return (
    <div
      className="w-full bg-white flex items-center justify-center"
      style={{ borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", minHeight: 65 }}
      dir={isEnglish ? "ltr" : "rtl"}
    >
      {/* Delivery button — matching source: width:144px, height:42px, borderRadius:3, margin:15px */}
      <button
        onClick={() => chooseMethod("delivery")}
        style={{
          width: 144,
          height: 42,
          borderRadius: 3,
          margin: "0 15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          fontWeight: "bold",
          fontSize: 14,
          fontFamily: "Quicksand, Cairo, sans-serif",
          border: deliveryMethod === "delivery" ? "1px solid #ff6600" : "1px solid #666666",
          backgroundColor: deliveryMethod === "delivery" ? "#ff6600" : "white",
          color: deliveryMethod === "delivery" ? "white" : "#666666",
          transition: "all 0.2s ease",
        }}
      >
        {isEnglish ? "Delivery" : "توصيل"}
      </button>

      {/* Pickup button */}
      <button
        onClick={() => chooseMethod("pickup")}
        style={{
          width: 144,
          height: 42,
          borderRadius: 3,
          margin: "0 15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          fontWeight: "bold",
          fontSize: 14,
          fontFamily: "Quicksand, Cairo, sans-serif",
          border: deliveryMethod === "pickup" ? "1px solid #ff6600" : "1px solid #666666",
          backgroundColor: deliveryMethod === "pickup" ? "#ff6600" : "white",
          color: deliveryMethod === "pickup" ? "white" : "#666666",
          transition: "all 0.2s ease",
        }}
      >
        {isEnglish ? "Pickup" : "استلام"}
      </button>
    </div>
  );
}
