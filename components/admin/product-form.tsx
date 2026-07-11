"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Save, ArrowLeft, Copy } from "@/lib/icons";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  nameAr: string;
  petType: string;
  slug: string;
}

interface ProductData {
  id?: string;
  name?: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  price?: number;
  originalPrice?: number | null;
  stock?: number;
  lowStockThreshold?: number;
  sku?: string;
  petType?: string;
  featured?: boolean;
  active?: boolean;
  categoryId?: string;
  images?: { id?: string; url: string; order: number }[];
}

export function ProductForm({ product, categories }: { product?: ProductData; categories: Category[] }) {
  const router = useRouter();
  const isEdit = !!product?.id;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: product?.name || "",
    nameAr: product?.nameAr || "",
    slug: product?.slug || "",
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || "",
    price: product?.price ?? 0,
    originalPrice: product?.originalPrice ?? null as number | null,
    stock: product?.stock ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 5,
    sku: product?.sku || "",
    petType: product?.petType || "general",
    featured: product?.featured ?? false,
    active: product?.active ?? true,
    categoryId: product?.categoryId || categories[0]?.id || "",
  });

  const [images, setImages] = useState<{ url: string }[]>(
    product?.images?.length ? product.images.map((i) => ({ url: i.url })) : []
  );

  const update = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: images.map((i) => i.url) }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Save failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  const duplicate = async () => {
    if (!product?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/duplicate`, { method: "POST" });
      if (res.ok) {
        const d = await res.json();
        router.push(`/admin/products/${d.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product?.id || !confirm("Delete this product? This cannot be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex gap-2 flex-wrap">
          {isEdit && (
            <>
              <button type="button" onClick={duplicate} disabled={saving} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50">
                <Copy className="w-4 h-4" /> Duplicate
              </button>
              <button type="button" onClick={remove} disabled={saving} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          )}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-[#ff6600] text-white hover:bg-[#e55b00] disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-bold text-gray-900">Basic info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Name (English)" value={form.name} onChange={(v) => update("name", v)} required />
          <Field label="Name (Arabic)" value={form.nameAr} onChange={(v) => update("nameAr", v)} dir="rtl" />
          <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} placeholder="auto-generated from name" />
          <Field label="SKU" value={form.sku} onChange={(v) => update("sku", v)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Description (English)</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Description (Arabic)</label>
          <textarea
            value={form.descriptionAr}
            onChange={(e) => update("descriptionAr", e.target.value)}
            dir="rtl"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-bold text-gray-900">Pricing & inventory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <NumField label="Price (KWD)" value={form.price} onChange={(v) => update("price", v)} step="0.001" required />
          <NumField label="Sale price" value={form.originalPrice} onChange={(v) => update("originalPrice", v)} step="0.001" />
          <NumField label="Stock" value={form.stock} onChange={(v) => update("stock", v)} />
          <NumField label="Low stock alert" value={form.lowStockThreshold} onChange={(v) => update("lowStockThreshold", v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-bold text-gray-900">Category & visibility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pet type</label>
            <select
              value={form.petType}
              onChange={(e) => update("petType", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              {["cats","dogs","birds","fish","rabbits","hamsters","reptiles","general"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} className="rounded" />
            <span>Active (visible on store)</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="rounded" />
            <span>Featured product</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Images ({images.length})</h3>
          <button
            type="button"
            onClick={() => setImages([...images, { url: "" }])}
            className="inline-flex items-center gap-1 text-sm text-[#ff6600] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add image
          </button>
        </div>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={img.url}
              onChange={(e) => setImages(images.map((im, j) => j === i ? { url: e.target.value } : im))}
              placeholder="Image URL or /images/products/..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
            {img.url && (
              <img src={img.url} alt="" className="w-10 h-10 rounded object-contain bg-gray-50" />
            )}
            <button
              type="button"
              onClick={() => setImages(images.filter((_, j) => j !== i))}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, required, dir, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; dir?: "rtl"; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && " *"}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        dir={dir}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
      />
    </div>
  );
}

function NumField({ label, value, onChange, step, required }: { label: string; value: number | null; onChange: (v: number | null) => void; step?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && " *"}</label>
      <input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
      />
    </div>
  );
}
