"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, X, Search, Store, Plus } from "@/lib/icons";

interface Branch { id: string; name: string; nameAr: string; }
interface Product { id: string; name: string; nameAr: string; sku: string | null; categoryId: string; }
interface Stock { branchId: string; productId: string; stock: number; active: boolean; }

export function BranchStockManager({
  branches,
  products,
  initialStocks,
}: {
  branches: Branch[];
  products: Product[];
  initialStocks: Stock[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [stockMap, setStockMap] = useState<Record<string, { stock: number; active: boolean }>>(() => {
    const m: Record<string, { stock: number; active: boolean }> = {};
    for (const s of initialStocks) m[`${s.branchId}:${s.productId}`] = { stock: s.stock, active: s.active };
    return m;
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [bulkBranch, setBulkBranch] = useState<string>(branches[0]?.id || "");
  const [bulkStock, setBulkStock] = useState<string>("50");

  const getStock = (branchId: string, productId: string) => stockMap[`${branchId}:${productId}`] || { stock: 0, active: false };

  const setStock = (branchId: string, productId: string, value: { stock: number; active: boolean }) => {
    setStockMap((m) => ({ ...m, [`${branchId}:${productId}`]: value }));
  };

  const save = async (branchId: string, productId: string) => {
    const key = `${branchId}:${productId}`;
    setSaving(key);
    try {
      await fetch("/api/admin/branch-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId, productId, ...stockMap[key] }),
      });
      router.refresh();
    } finally { setSaving(null); }
  };

  const bulkSet = async () => {
    if (!bulkBranch) return;
    const stock = parseInt(bulkStock) || 0;
    if (!confirm(`Set stock to ${stock} for ALL products in ${branches.find(b => b.id === bulkBranch)?.name}?`)) return;
    setSaving("bulk");
    try {
      for (const p of products) {
        await fetch("/api/admin/branch-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ branchId: bulkBranch, productId: p.id, stock, active: true }),
        });
      }
      router.refresh();
    } finally { setSaving(null); }
  };

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
          <span className="text-xs text-gray-600 font-semibold">Bulk set:</span>
          <select value={bulkBranch} onChange={(e) => setBulkBranch(e.target.value)} className="px-2 py-1 rounded border border-gray-300 text-xs">
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <input type="number" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} className="w-16 px-2 py-1 rounded border border-gray-300 text-xs" />
          <button onClick={bulkSet} disabled={saving === "bulk"} className="px-3 py-1 bg-[#ff6600] text-white text-xs font-semibold rounded disabled:opacity-50">
            {saving === "bulk" ? "Setting..." : "Set All"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left p-3 sticky left-0 bg-gray-50 z-10 min-w-[200px]">Product</th>
                <th className="text-left p-3 hidden sm:table-cell">SKU</th>
                {branches.map((b) => (
                  <th key={b.id} className="text-left p-3 min-w-[140px]">
                    <div className="text-xs">{b.name}</div>
                    <div className="text-[10px] text-gray-400 font-normal">{b.nameAr}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={2 + branches.length} className="text-center p-12 text-gray-500">No products found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="p-3 sticky left-0 bg-white z-10">
                    <p className="font-medium text-gray-900 text-xs">{p.name}</p>
                    <p className="text-[10px] text-gray-500" dir="rtl">{p.nameAr}</p>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-[10px] font-mono text-gray-500">{p.sku || "—"}</td>
                  {branches.map((b) => {
                    const s = getStock(b.id, p.id);
                    const key = `${b.id}:${p.id}`;
                    return (
                      <td key={b.id} className="p-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={s.stock}
                            onChange={(e) => setStock(b.id, p.id, { ...s, stock: parseInt(e.target.value) || 0 })}
                            className="w-16 px-1.5 py-1 rounded border border-gray-300 text-xs"
                            min="0"
                          />
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={s.active}
                              onChange={(e) => setStock(b.id, p.id, { ...s, active: e.target.checked })}
                              className="rounded text-xs"
                            />
                          </label>
                          <button
                            onClick={() => save(b.id, p.id)}
                            disabled={saving === key}
                            className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
