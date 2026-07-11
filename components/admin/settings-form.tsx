"use client";

import { useState } from "react";
import { Save, Loader2 } from "@/lib/icons";

const FIELDS = [
  { key: "store.name", label: "Store Name", type: "text" },
  { key: "store.tagline", label: "Tagline", type: "text" },
  { key: "store.email", label: "Email", type: "email" },
  { key: "store.phone", label: "Phone", type: "tel" },
  { key: "store.whatsapp", label: "WhatsApp", type: "tel" },
  { key: "store.instagram", label: "Instagram URL", type: "url" },
  { key: "store.facebook", label: "Facebook URL", type: "url" },
  { key: "store.currency", label: "Currency", type: "text" },
  { key: "store.taxRate", label: "Tax Rate (%)", type: "number" },
  { key: "delivery.fee", label: "Delivery Fee (KWD)", type: "number" },
  { key: "delivery.freeThreshold", label: "Free Delivery Threshold (KWD)", type: "number" },
  { key: "delivery.estimatedTime", label: "Estimated Delivery Time", type: "text" },
];

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-bold text-gray-900">Store Information</h3>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
            <input
              type={f.type}
              value={data[f.key] || ""}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save settings
        </button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  );
}
