"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Image as ImageIcon, Eye, EyeOff, GripVertical, Upload } from "@/lib/icons";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  position: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

export function BannersManager({ initial }: { initial: Banner[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", link: "", position: "hero" as const, active: true });
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: banners.length }),
      });
      if (!res.ok) throw new Error("Failed to add banner");
      setAdding(false);
      setForm({ title: "", subtitle: "", imageUrl: "", link: "", position: "hero", active: true });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    setBanners((bs) => bs.map((b) => b.id === id ? { ...b, active } : b));
    await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    setBanners((bs) => bs.filter((b) => b.id !== id));
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Hero Banners ({banners.length})</h3>
        <button onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-3 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h4 className="font-semibold text-gray-900">New Banner</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Link (optional)</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/products or https://..." className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Banner Image *</label>
            <div className="flex gap-2">
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required placeholder="/images/banners/your-image.jpg or https://..." className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
              <label className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview" className="mt-2 h-24 rounded-lg object-cover bg-gray-100" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
              Active (visible on site)
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving || !form.imageUrl} className="px-4 py-2 bg-[#ff6600] text-white text-sm font-semibold rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : "Add Banner"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            <ImageIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            No banners yet. Add your first hero banner above.
          </div>
        ) : banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              {!b.active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">Hidden</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{b.title}</h4>
                  {b.subtitle && <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(b.id, !b.active)} className={`p-1.5 rounded ${b.active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`} title={b.active ? "Hide" : "Show"}>
                    {b.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(b.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {b.link && <p className="text-xs text-blue-600 truncate mb-1">→ {b.link}</p>}
              <p className="text-[10px] text-gray-400">Position: {b.position} · Order: {b.order}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
