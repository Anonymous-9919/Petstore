"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Store, Phone, MapPin, Clock, Save, X } from "@/lib/icons";

interface Branch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  phone: string[];
  hours: string;
  hoursAr: string;
  lat: number;
  lng: number;
  active: boolean;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  orderCount: number;
}

export function BranchesManager({ initial }: { initial: Branch[] }) {
  const router = useRouter();
  const [branches, setBranches] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", nameAr: "", address: "", addressAr: "", phones: "+965 ", hours: "Daily 10:00 AM - 10:00 PM", hoursAr: "يومياً من 10:00 صباحاً حتى 10:00 مساءً", lat: 29.3, lng: 47.9 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const phone = form.phones.split(",").map((p) => p.trim()).filter(Boolean);
      const res = await fetch("/api/admin/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, phone }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setAdding(false);
      setForm({ name: "", nameAr: "", address: "", addressAr: "", phones: "+965 ", hours: "Daily 10:00 AM - 10:00 PM", hoursAr: "يومياً من 10:00 صباحاً حتى 10:00 مساءً", lat: 29.3, lng: 47.9 });
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete branch "${name}"? Orders referencing this branch must be reassigned first.`)) return;
    const res = await fetch(`/api/admin/branches/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else { const d = await res.json(); alert(d.error); }
  };

  const handleEdit = async (id: string, data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/branches/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setEditingId(null);
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branches</h2>
          <p className="text-sm text-gray-500">{branches.length} branches · {branches.reduce((s, b) => s + b.orderCount, 0)} orders</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2.5 rounded-lg w-fit">
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {adding && <BranchForm form={form} setForm={setForm} onSubmit={handleAdd} onCancel={() => setAdding(false)} saving={saving} title="New Branch" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {branches.map((b) => (
          <div key={b.id} className={`bg-white rounded-2xl border-t-4 border-[#ff6600] p-5 shadow-md ${!b.active ? "opacity-60" : ""}`}>
            {editingId === b.id ? (
              <BranchEditForm branch={b} onSave={(d) => handleEdit(b.id, d)} onCancel={() => setEditingId(null)} saving={saving} />
            ) : (
              <>
                <h3 className="font-bold text-gray-900 mb-1">{b.name}</h3>
                <p className="text-xs text-gray-500 mb-3" dir="rtl">{b.nameAr}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-[#ff6600] shrink-0" />
                    <span className="line-clamp-2">{b.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 text-[#ff6600] shrink-0" />
                    <div className="flex flex-col" dir="ltr">{b.phone.map((p) => <span key={p}>{p}</span>)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ff6600] shrink-0" />
                    <span className="text-xs">{b.hours}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${b.deliveryAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>Delivery</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${b.pickupAvailable ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>Pickup</span>
                  </div>
                  <span className="text-gray-500">{b.orderCount} orders</span>
                </div>
                <div className="mt-3 flex gap-1">
                  <button onClick={() => setEditingId(b.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded border border-gray-200 hover:bg-gray-50">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(b.id, b.name)} className="px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function BranchForm({ form, setForm, onSubmit, onCancel, saving, title }: { form: any; setForm: (f: any) => void; onSubmit: (e: React.FormEvent) => void; onCancel: () => void; saving: boolean; title: string }) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <button type="button" onClick={onCancel} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Name (English)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" placeholder="Name (Arabic)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="Address (English)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        <input value={form.addressAr} onChange={(e) => setForm({ ...form, addressAr: e.target.value })} required dir="rtl" placeholder="Address (Arabic)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        <input value={form.phones} onChange={(e) => setForm({ ...form, phones: e.target.value })} required placeholder="Phone (comma-separated)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" step="0.0001" value={form.lat} onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) })} required placeholder="Latitude" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
          <input type="number" step="0.0001" value={form.lng} onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) })} required placeholder="Longitude" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        </div>
        <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} required placeholder="Hours (English)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
        <input value={form.hoursAr} onChange={(e) => setForm({ ...form, hoursAr: e.target.value })} required dir="rtl" placeholder="Hours (Arabic)" className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked onChange={(e) => setForm({ ...form, deliveryAvailable: e.target.checked })} /> Delivery</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked onChange={(e) => setForm({ ...form, pickupAvailable: e.target.checked })} /> Pickup</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-[#ff6600] text-white text-sm font-semibold rounded-lg disabled:opacity-50">{saving ? "Saving..." : "Create Branch"}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">Cancel</button>
      </div>
    </form>
  );
}

function BranchEditForm({ branch, onSave, onCancel, saving }: { branch: Branch; onSave: (d: any) => void; onCancel: () => void; saving: boolean }) {
  const [data, setData] = useState({
    name: branch.name, nameAr: branch.nameAr, address: branch.address, addressAr: branch.addressAr,
    phone: branch.phone.join(", "), hours: branch.hours, hoursAr: branch.hoursAr,
    lat: branch.lat, lng: branch.lng,
    active: branch.active, deliveryAvailable: branch.deliveryAvailable, pickupAvailable: branch.pickupAvailable,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); const phone = (data.phone as string).split(",").map(p => p.trim()).filter(Boolean); onSave({ ...data, phone }); }} className="space-y-2">
      <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <input value={data.nameAr} onChange={(e) => setData({ ...data, nameAr: e.target.value })} required dir="rtl" className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <input value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} required className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <input value={data.addressAr} onChange={(e) => setData({ ...data, addressAr: e.target.value })} required dir="rtl" className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} required placeholder="Phones (comma-separated)" className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      <div className="grid grid-cols-2 gap-1">
        <input type="number" step="0.0001" value={data.lat} onChange={(e) => setData({ ...data, lat: parseFloat(e.target.value) })} required className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
        <input type="number" step="0.0001" value={data.lng} onChange={(e) => setData({ ...data, lng: parseFloat(e.target.value) })} required className="w-full px-2 py-1.5 rounded border border-gray-300 text-xs" />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <label className="flex items-center gap-1"><input type="checkbox" checked={data.active} onChange={(e) => setData({ ...data, active: e.target.checked })} /> Active</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={data.deliveryAvailable} onChange={(e) => setData({ ...data, deliveryAvailable: e.target.checked })} /> Delivery</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={data.pickupAvailable} onChange={(e) => setData({ ...data, pickupAvailable: e.target.checked })} /> Pickup</label>
      </div>
      <div className="flex gap-1">
        <button type="submit" disabled={saving} className="flex-1 px-2 py-1.5 bg-[#ff6600] text-white text-xs rounded disabled:opacity-50">Save</button>
        <button type="button" onClick={onCancel} className="px-2 py-1.5 text-xs border border-gray-300 rounded">Cancel</button>
      </div>
    </form>
  );
}
