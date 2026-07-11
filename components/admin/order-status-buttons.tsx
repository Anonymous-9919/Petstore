"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "@/lib/icons";

const STATUSES = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

const NEXT: Record<string, string> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "out_for_delivery",
  out_for_delivery: "delivered",
};

export function OrderStatusButtons({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (status: string) => {
    setLoading(status);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const next = NEXT[currentStatus];

  return (
    <div className="flex flex-wrap gap-2">
      {next && (
        <button
          onClick={() => update(next)}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading === next ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Mark as {next.replace(/_/g, " ")}
        </button>
      )}
      {currentStatus !== "cancelled" && currentStatus !== "delivered" && (
        <button
          onClick={() => update("cancelled")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Cancel order
        </button>
      )}
    </div>
  );
}
