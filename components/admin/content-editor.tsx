"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "@/lib/icons";

export function ContentEditor({ initial }: { initial: Record<string, Record<string, string>> }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const groups: { key: string; label: string; fields: { key: string; label: string; dir?: "rtl" }[] }[] = [
    {
      key: "home.hero",
      label: "Homepage Hero",
      fields: [
        { key: "title", label: "Title (EN)" },
        { key: "title", label: "Title (AR)", dir: "rtl" },
        { key: "subtitle", label: "Subtitle (EN)" },
        { key: "subtitle", label: "Subtitle (AR)", dir: "rtl" },
        { key: "cta", label: "CTA Button (EN)" },
        { key: "cta", label: "CTA Button (AR)", dir: "rtl" },
      ],
    },
  ];

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const get = (group: string, field: string, lang: "en" | "ar") =>
    data[group]?.[lang + field] || "";

  const set = (group: string, field: string, lang: "en" | "ar", value: string) => {
    setData((d) => ({
      ...d,
      [group]: { ...(d[group] || {}), [lang + field]: value },
    }));
  };

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.key} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 className="font-bold text-gray-900">{g.label}</h3>
          {g.fields.map((f, i) => {
            const lang: "en" | "ar" = i % 2 === 0 ? "en" : "ar";
            return (
              <div key={i}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                <textarea
                  value={get(g.key, f.key, lang)}
                  onChange={(e) => set(g.key, f.key, lang, e.target.value)}
                  dir={f.dir}
                  rows={f.key.includes("subtitle") ? 3 : 1}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                />
              </div>
            );
          })}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save content
        </button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  );
}
