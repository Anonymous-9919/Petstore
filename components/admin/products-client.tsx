"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Copy, Trash2, Search, Star } from "@/lib/icons";

interface ProductRow {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  active: boolean;
  onSale: boolean;
  category: { name: string; nameAr: string };
  images: { url: string }[];
}

interface ProductsClientProps {
  products: ProductRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

export function ProductsClient({ products, total, currentPage, totalPages, searchQuery }: ProductsClientProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const formatKWD = (n: number) => `${n.toFixed(3)} KWD`;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert("Delete failed");
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
      if (res.ok) {
        const d = await res.json();
        router.push(`/admin/products/${d.id}`);
      }
    } catch {
      alert("Duplicate failed");
    } finally {
      setDuplicating(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3 hidden md:table-cell">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3 hidden sm:table-cell">Stock</th>
              <th className="text-left p-3 hidden lg:table-cell">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-12 text-gray-500">
                  {searchQuery ? `No products found for "${searchQuery}"` : "No products yet. Click 'Add Product' to create your first one."}
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const img = p.images?.[0]?.url;
                const lowStock = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                          {img ? (
                            <img src={img} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-lg">🐾</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-xs">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-gray-600">{p.category?.name || "—"}</td>
                    <td className="p-3 font-semibold text-[#ff6600]">{formatKWD(p.price)}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={lowStock ? "text-red-600 font-semibold" : "text-gray-700"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {p.featured && <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">Featured</span>}
                        {p.onSale && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Sale</span>}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          disabled={duplicating === p.id}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-gray-100 text-sm">
          <span className="text-gray-500">
            Page {currentPage} of {totalPages} · {total} products
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link href={`/admin/products?q=${searchQuery}&page=${currentPage - 1}`} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link href={`/admin/products?q=${searchQuery}&page=${currentPage + 1}`} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
