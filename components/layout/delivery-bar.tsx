"use client";

import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";

const STORAGE_KEY = "ps_fulfillment_method";
const BRANCH_KEY = "ps_selected_branch";

export default function DeliveryBar() {
  const { locale } = useLocale();
  const { deliveryMethod, setDeliveryMethod, setSelectedBranch } = useCartStore();
  const isEnglish = locale === "en";

  const chooseMethod = (method: "delivery" | "pickup") => {
    setDeliveryMethod(method);
    try { window.sessionStorage.setItem(STORAGE_KEY, method); } catch {}
    if (method === "delivery") {
      try { window.sessionStorage.removeItem(BRANCH_KEY); } catch {}
      setSelectedBranch("");
    }
  };

  return (
    <div
      className="w-full bg-white"
      style={{ borderTop: "1px solid #dee2e6" }}
      dir={isEnglish ? "ltr" : "rtl"}
    >
      <div
        className="flex items-center justify-center bg-white border-b"
        style={{ borderColor: "#dee2e6", minHeight: 65, whiteSpace: "nowrap" }}
      >
        {/* Delivery button */}
        <div className="flex-1 max-w-[150px] flex items-center justify-center bg-white m-auto py-2">
          <button
            onClick={() => chooseMethod("delivery")}
            style={{
              lineHeight: 3,
              width: "100%",
              maxHeight: 40,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "none",
              borderRadius: 3,
              padding: "0 16px",
              border: deliveryMethod !== "delivery" ? "1px solid #666666" : "none",
              color: deliveryMethod !== "delivery" ? "#666666" : undefined,
              backgroundColor: deliveryMethod === "delivery" ? undefined : "white",
            }}
            className={`text-sm transition-colors ${
              deliveryMethod === "delivery"
                ? "bg-[#ff6600] text-white"
                : "text-[#666]"
            }`}
          >
            {isEnglish ? "Delivery" : "توصيل"}
          </button>
        </div>

        {/* Pickup button */}
        <div className="flex-1 max-w-[150px] flex items-center justify-center bg-white m-auto py-2">
          <button
            onClick={() => chooseMethod("pickup")}
            style={{
              lineHeight: 3,
              width: "100%",
              maxHeight: 40,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "none",
              borderRadius: 3,
              padding: "0 16px",
              border: deliveryMethod !== "pickup" ? "1px solid #666666" : "none",
              color: deliveryMethod !== "pickup" ? "#666666" : undefined,
              backgroundColor: deliveryMethod === "pickup" ? undefined : "white",
            }}
            className={`text-sm transition-colors ${
              deliveryMethod === "pickup"
                ? "bg-[#ff6600] text-white"
                : "text-[#666]"
            }`}
          >
            {isEnglish ? "Pickup" : "استلام"}
          </button>
        </div>
      </div>
    </div>
  );
}
