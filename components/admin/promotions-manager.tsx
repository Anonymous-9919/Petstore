"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Ticket, X, Save } from "@/lib/icons";

interface Promo {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  active: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  createdAt: Date;
}

export function PromotionsManager({ initial }: { initial: Promo[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", type: "PERCENT" as "PERCENT" | "FIXED", value: 10, minOrder: 0, startsAt: "", expiresAt: "", usageLimit: "" as string | number });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = { ...form };
      if (!body.startsAt) delete body.startsAt;
      else body.startsAt = new Date(body.startsAt as string).toISOString();
      if (!body.expiresAt) delete body.expiresAt;
      else body.expiresAt = new Date(body.expiresAt as string).toISOString();
      if (!body.usageLimit) body.usageLimit = null;
      else body.usageLimit = Number(body.usageLimit);
      const res = await fetch("/api/admin/promotions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setAdding(false);
      setForm({ code: "", type: "PERCENT", value: 10, minOrder: 0, startsAt: "", expiresAt: "", usageLimit: "" });
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = async (id: string, data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setEditingId(null);
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Promotions</h2>
          <p className="text-sm text-gray-500">{initial.length} coupons</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2.5 rounded-lg w-fit">
          <Plus className="w-4 h-4" /> Add Promotion
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 className="font-bold text-gray-900">New Promotion</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Code *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="SUMMER20" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm uppercase" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENT" | "FIXED" })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm">
                <option value="PERCENT">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (KWD)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Value *</label>
              <input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order (KWD)</label>
              <input type="number" step="0.01" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Usage Limit</label>
              <input type="number" value={form.usageLimit as string} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
              <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
              <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#ff6600] text-white text-sm font-semibold rounded-lg disabled:opacity-50">{saving ? "Saving..." : "Create"}</button>
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Value</th>
                <th className="text-left p-3 hidden sm:table-cell">Min Order</th>
                <th className="text-left p-3 hidden md:table-cell">Usage</th>
                <th className="text-left p-3 hidden lg:table-cell">Expires</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initial.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-12 text-gray-500">No promotions yet. Click "Add Promotion" to create your first coupon.</td></tr>
              ) : initial.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="p-3 font-mono font-semibold text-gray-900">{p.code}</td>
                  <td className="p-3 text-gray-600">{p.type === "PERCENT" ? "Percentage" : "Fixed"}</td>
                  <td className="p-3 font-semibold text-[#ff6600]">{p.type === "PERCENT" ? `${p.value}%` : `${p.value} KWD`}</td>
                  <td className="p-3 hidden sm:table-cell text-gray-600">{p.minOrder} KWD</td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{p.usedCount}{p.usageLimit ? ` / ${p.usageLimit}` : ""}</td>
                  <td className="p-3 hidden lg:table-cell text-xs text-gray-500">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "—"}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditingId(p.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded ml-1" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (() => {
        const p = initial.find(x => x.id === editingId)!;
        return <EditPromoModal promo={p} onSave={(d) => handleEdit(p.id, d)} onClose={() => setEditingId(null)} saving={saving} />;
      })()}
    </>
  );
}

function EditPromoModal({ promo, onSave, onClose, saving }: { promo: Promo; onSave: (d: any) => void; onClose: () => void; saving: boolean }) {
  const [data, setData] = useState({
    code: promo.code, type: promo.type as "PERCENT" | "FIXED", value: promo.value, minOrder: promo.minOrder,
    active: promo.active, usageLimit: promo.usageLimit?.toString() || "",
    startsAt: promo.startsAt ? promo.startsAt.slice(0, 16) : "",
    expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 16) : "",
  });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Edit {promo.code}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const body: Record<string, unknown> = {
            ...data,
            value: Number(data.value),
            minOrder: Number(data.minOrder),
            usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
            startsAt: data.startsAt ? new Date(data.startsAt).toISOString() : null,
            expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
          };
          onSave(body);
        }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Code</label>
              <input value={data.code} onChange={(e) => setData({ ...data, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select value={data.type} onChange={(e) => setData({ ...data, type: e.target.value as "PERCENT" | "FIXED" })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm">
                <option value="PERCENT">Percentage</option>
                <option value="FIXED">Fixed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Value</label>
              <input type="number" step="0.01" value={data.value} onChange={(e) => setData({ ...data, value: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order</label>
              <input type="number" step="0.01" value={data.minOrder} onChange={(e) => setData({ ...data, minOrder: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Usage Limit</label>
              <input type="number" value={data.usageLimit} onChange={(e) => setData({ ...data, usageLimit: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={data.active} onChange={(e) => setData({ ...data, active: e.target.checked })} /> Active</label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
              <input type="datetime-local" value={data.startsAt} onChange={(e) => setData({ ...data, startsAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
              <input type="datetime-local" value={data.expiresAt} onChange={(e) => setData({ ...data, expiresAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#ff6600] text-white text-sm font-semibold rounded-lg disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
