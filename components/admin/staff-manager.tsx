"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserCog, Loader2, Trash2 } from "@/lib/icons";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

export function StaffManager({ initial, currentUserId }: { initial: Staff[]; currentUserId: string }) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      setShowNew(false);
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  };

  const changeRole = async (id: string, role: string) => {
    await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add staff
        </button>
      </div>

      {showNew && (
        <form onSubmit={create} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 className="font-bold text-gray-900">New user</h3>
          {error && <div className="p-2 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password (min 8 chars)"
              minLength={8}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#ff6600] text-white text-sm font-semibold rounded-lg">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3 hidden sm:table-cell">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="p-3">
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="p-3 hidden sm:table-cell">
                  {u.id === currentUserId ? (
                    <span className="text-xs font-semibold">{u.role}</span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="MANAGER">Manager</option>
                      <option value="OWNER">Owner</option>
                    </select>
                  )}
                </td>
                <td className="p-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {u.id !== currentUserId && (
                    <>
                      <button
                        onClick={() => toggle(u.id, !u.active)}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        {u.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
