"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Tags, X, Upload } from "@/lib/icons";

interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  petType: string;
  image: string | null;
  order: number;
  active: boolean;
  count: number;
}

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [cats, setCats] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", nameAr: "", petType: "general", image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "categories");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((f) => ({ ...f, image: data.url }));
    } catch (e) { setError("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setAdding(false);
      setForm({ name: "", nameAr: "", petType: "general", image: "" });
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = async (id: string, data: Partial<Category>) => {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setEditingId(null);
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category must be moved first.`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else { const d = await res.json(); alert(d.error); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    setCats(cs => cs.map(c => c.id === id ? { ...c, active } : c));
    await handleEdit(id, { active });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">{cats.length} categories · {cats.reduce((s, c) => s + c.count, 0)} products total</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2.5 rounded-lg w-fit">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 className="font-bold text-gray-900">New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Name (English) *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Name (Arabic) *</label>
              <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Pet Type *</label>
              <select value={form.petType} onChange={(e) => setForm({ ...form, petType: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm">
                {["cats","dogs","birds","fish","rabbits","hamsters","reptiles","general"].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Image</label>
              <div className="flex gap-2">
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/uploads/categories/..." className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
                <label className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploading ? "..." : "Upload"}
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
          {form.image && <img src={form.image} alt="" className="h-20 rounded object-cover bg-gray-100" />}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#ff6600] text-white text-sm font-semibold rounded-lg disabled:opacity-50">{saving ? "Saving..." : "Create"}</button>
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((c) => (
          <div key={c.id} className={`bg-white rounded-2xl border p-4 flex flex-col h-full ${c.active ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Tags className="w-6 h-6 text-gray-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-500 truncate" dir="rtl">{c.nameAr}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.petType} · {c.count} products</p>
              </div>
            </div>
            {editingId === c.id ? (
              <CategoryEditForm cat={c} onSave={(d) => handleEdit(c.id, d)} onCancel={() => setEditingId(null)} saving={saving} />
            ) : (
              <div className="mt-auto flex items-center justify-between gap-1 pt-2 border-t border-gray-100">
                <Link href={`/products?category=${c.slug}`} className="text-xs text-[#ff6600] hover:underline">
                  View products ({c.count}) →
                </Link>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(c.id, !c.active)} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => setEditingId(c.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function CategoryEditForm({ cat, onSave, onCancel, saving }: { cat: { id: string; name: string; nameAr: string; petType: string; image: string | null }; onSave: (d: any) => void; onCancel: () => void; saving: boolean }) {
  const [data, setData] = useState({ name: cat.name, nameAr: cat.nameAr, petType: cat.petType, image: cat.image || "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="mt-auto space-y-2 pt-2 border-t border-gray-100">
      <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <input value={data.nameAr} onChange={(e) => setData({ ...data, nameAr: e.target.value })} required dir="rtl" className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <select value={data.petType} onChange={(e) => setData({ ...data, petType: e.target.value })} className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs">
        {["cats","dogs","birds","fish","rabbits","hamsters","reptiles","general"].map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <div className="flex gap-1">
        <button type="submit" disabled={saving} className="flex-1 px-2 py-1.5 bg-[#ff6600] text-white text-xs rounded disabled:opacity-50">Save</button>
        <button type="button" onClick={onCancel} className="px-2 py-1.5 text-xs border border-gray-300 rounded">Cancel</button>
      </div>
    </form>
  );
}
