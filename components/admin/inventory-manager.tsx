"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, AlertTriangle, Package, TrendingDown, Edit, Check, X, Search, ChevronDown, ChevronUp, Info, FileText } from "@/lib/icons";

interface Product {
  id: string;
  name: string;
  nameAr: string;
  sku: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  petType: string;
  active: boolean;
  featured: boolean;
  onSale: boolean;
  categoryName: string;
  categorySlug: string;
  description: string | null;
  descriptionAr: string | null;
  createdAt: string;
}

type ImportMode = "upsert" | "create_only" | "update_only";

interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  imagesDownloaded: number;
  errors: string[];
  mode: string;
  details: { created: string[]; updated: string[]; skipped: string[] };
}

export function InventoryManager({ initial }: { initial: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(5);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [downloadImages, setDownloadImages] = useState(true);
  const [importMode, setImportMode] = useState<ImportMode>("upsert");
  const [showFormatHelp, setShowFormatHelp] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [sortAsc, setSortAsc] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const formatKWD = (n: number) => `${n.toFixed(3)} KWD`;

  const handleExport = async (type: "inventory" | "products") => {
    window.location.href = `/api/admin/export?type=${type}`;
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditStock(p.stock);
    setEditThreshold(p.lowStockThreshold);
  };

  const saveStock = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: editStock, lowStockThreshold: editThreshold }),
      });
      if (res.ok) {
        setProducts((ps) => ps.map((p) => p.id === id ? { ...p, stock: editStock, lowStockThreshold: editThreshold } : p));
        setEditingId(null);
        router.refresh();
      }
    } finally { setSavingId(null); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    setImportError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("downloadImages", downloadImages ? "1" : "0");
      // Attach uploaded image files (matched by SKU in filename)
      for (const img of imageFiles) {
        fd.append("images", img, img.name);
      }
      const res = await fetch(`/api/admin/import?type=products&mode=${importMode}`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setImportResult(data);
        setImageFiles([]); // clear after success
        router.refresh();
      } else {
        setImportError(data.error || "Import failed");
        if (data.expectedColumns) setImportError(data.error + "\n\nExpected columns: " + data.expectedColumns.join(", "));
      }
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !(p.sku || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "low" && p.stock > p.lowStockThreshold) return false;
    if (filter === "out" && p.stock > 0) return false;
    return true;
  }).sort((a, b) => sortAsc ? a.stock - b.stock : b.stock - a.stock);

  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500">{products.length} products · {formatKWD(totalValue)} total value</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleExport("inventory")} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <label className={`inline-flex items-center gap-1.5 px-3 py-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold rounded-lg cursor-pointer ${importing ? "opacity-50" : ""}`}>
            <Upload className="w-4 h-4" /> {importing ? "Importing..." : "Import CSV"}
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" disabled={importing} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Package className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total stock value</p>
              <p className="text-xl font-bold">{formatKWD(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Low stock items</p>
              <p className="text-xl font-bold">{lowStock.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Out of stock</p>
              <p className="text-xl font-bold">{outOfStock.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Import Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Import mode:</label>
            <select value={importMode} onChange={(e) => setImportMode(e.target.value as ImportMode)} className="px-2 py-1.5 rounded border border-gray-300 text-sm">
              <option value="upsert">Update existing + Add new (default)</option>
              <option value="create_only">Only add new (skip duplicates)</option>
              <option value="update_only">Only update existing (skip new)</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={downloadImages} onChange={(e) => setDownloadImages(e.target.checked)} />
            Download external images (from URLs in CSV)
          </label>
          <button onClick={() => setShowFormatHelp(!showFormatHelp)} className="inline-flex items-center gap-1 text-xs text-[#ff6600] hover:underline sm:ml-auto">
            <Info className="w-3.5 h-3.5" /> {showFormatHelp ? "Hide" : "Show"} CSV format help
          </button>
        </div>

        {/* Bulk image upload */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <label className="flex-1">
              <span className="block text-xs font-semibold text-gray-700 mb-1">Bulk product images (optional)</span>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFiles}
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#ff6600] file:text-white hover:file:bg-[#e55b00] file:cursor-pointer"
              />
            </label>
          </div>
          <p className="text-[10px] text-gray-500 mb-2">
            Select multiple images at once. Files are matched to products by SKU in the filename (e.g. <code className="bg-white px-1 rounded">SKU001.jpg</code>, <code className="bg-white px-1 rounded">SKU001-1.jpg</code>, <code className="bg-white px-1 rounded">SKU001-2.jpg</code>).
            Multiple images per product are supported via <code className="bg-white px-1 rounded">-1</code>, <code className="bg-white px-1 rounded">-2</code> suffixes.
          </p>
          {imageFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">Selected ({imageFiles.length}):</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {imageFiles.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 rounded px-2 py-1">
                    {f.name}
                    <button onClick={() => removeImageFile(i)} className="text-red-500 hover:text-red-700 font-bold ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {showFormatHelp && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-2">
            <p className="font-semibold text-blue-900">CSV Format Contract — file must have these exact columns (in any order):</p>
            <code className="block bg-white p-2 rounded border border-blue-100 text-[10px] overflow-x-auto whitespace-nowrap">
              sku, name, nameAr, slug, category, categoryAr, petType, price, originalPrice, stock, lowStockThreshold, description, descriptionAr, images, active, featured
            </code>

            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-red-900 mb-1">REQUIRED VALUES (must not be empty):</p>
              <div className="flex flex-wrap gap-1.5">
                {["sku","name","category","petType","price","stock","active"].map(f => (
                  <span key={f} className="text-[10px] font-mono font-semibold bg-white border border-red-200 text-red-800 rounded px-1.5 py-0.5">{f}</span>
                ))}
              </div>
              <p className="text-[10px] text-red-700 mt-1">Rows missing any of these will be <strong>skipped</strong> with a clear reason.</p>
            </div>

            <div className="p-2 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-900 mb-1">OPTIONAL (default values applied if empty):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-green-800">
                <div><strong>nameAr</strong> → defaults to <code>name</code></div>
                <div><strong>slug</strong> → auto-generated from name</div>
                <div><strong>categoryAr</strong> → defaults to <code>category</code></div>
                <div><strong>categorySlug</strong> → alternative to <code>category</code></div>
                <div><strong>originalPrice</strong> → empty (no sale)</div>
                <div><strong>lowStockThreshold</strong> → 5</div>
                <div><strong>description / descriptionAr</strong> → empty</div>
                <div><strong>images</strong> → empty (add via product page)</div>
                <div><strong>featured</strong> → false (0)</div>
              </div>
            </div>

            <p className="text-[11px] text-blue-700 pt-1 border-t border-blue-200">
              <strong>How to add a new product:</strong> Use a unique SKU (e.g. NEW-PROD-001) that doesn't exist yet. To update an existing product, use its current SKU.
              Arabic text is fully supported (UTF-8 encoded). Do NOT change column headers — they must match exactly.
            </p>
          </div>
        )}
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="p-4 rounded-2xl border border-green-200 bg-green-50">
          <h3 className="font-bold text-gray-900 mb-2">✓ Import Complete ({importResult.mode})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <div className="bg-white p-2 rounded border"><span className="text-gray-500 text-xs">Created</span><p className="font-bold text-green-700">{importResult.created}</p></div>
            <div className="bg-white p-2 rounded border"><span className="text-gray-500 text-xs">Updated</span><p className="font-bold text-blue-700">{importResult.updated}</p></div>
            <div className="bg-white p-2 rounded border"><span className="text-gray-500 text-xs">Skipped</span><p className="font-bold text-yellow-700">{importResult.skipped}</p></div>
            <div className="bg-white p-2 rounded border"><span className="text-gray-500 text-xs">Images</span><p className="font-bold text-purple-700">{importResult.imagesDownloaded}</p></div>
          </div>
          {(importResult.details.created.length > 0 || importResult.details.updated.length > 0) && (
            <details className="text-xs">
              <summary className="cursor-pointer font-semibold text-gray-700">View details ({importResult.details.created.length + importResult.details.updated.length} items)</summary>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {importResult.details.created.length > 0 && (
                  <div className="bg-white p-2 rounded border">
                    <p className="font-semibold text-green-700">Created:</p>
                    <ul className="list-disc pl-4 text-gray-600">
                      {importResult.details.created.slice(0, 10).map((c, i) => <li key={i}>{c}</li>)}
                      {importResult.details.created.length > 10 && <li>... {importResult.details.created.length - 10} more</li>}
                    </ul>
                  </div>
                )}
                {importResult.details.updated.length > 0 && (
                  <div className="bg-white p-2 rounded border">
                    <p className="font-semibold text-blue-700">Updated:</p>
                    <ul className="list-disc pl-4 text-gray-600">
                      {importResult.details.updated.slice(0, 10).map((c, i) => <li key={i}>{c}</li>)}
                      {importResult.details.updated.length > 10 && <li>... {importResult.details.updated.length - 10} more</li>}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          )}
          {importResult.details.skipped.length > 0 && (
            <details className="text-xs mt-2">
              <summary className="cursor-pointer font-semibold text-yellow-700">Skipped ({importResult.details.skipped.length})</summary>
              <ul className="mt-1 list-disc pl-4 text-gray-600 max-h-32 overflow-y-auto">
                {importResult.details.skipped.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}

      {importError && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-700 mb-1">✗ Import Failed</h3>
          <pre className="text-xs text-red-800 whitespace-pre-wrap font-sans">{importError}</pre>
          <p className="text-xs text-red-600 mt-2">Tip: Export a fresh CSV from this page and edit only the data values — do not change column headers.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as "all" | "low" | "out")} className="px-3 py-2 rounded-lg border border-gray-300 text-sm">
          <option value="all">All products</option>
          <option value="low">Low stock only</option>
          <option value="out">Out of stock only</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3 hidden md:table-cell">SKU</th>
                <th className="text-left p-3 hidden lg:table-cell">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">
                  <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-1 font-semibold">
                    Stock {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </th>
                <th className="text-left p-3 hidden sm:table-cell">Threshold</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-12 text-gray-500">No products match your filters</td></tr>
              ) : filtered.map((p) => {
                const status = p.stock === 0 ? "out" : p.stock <= p.lowStockThreshold ? "low" : "ok";
                return (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.petType}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell font-mono text-xs text-gray-600">{p.sku || "—"}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-600 text-xs">{p.categoryName}</td>
                    <td className="p-3 font-semibold text-[#ff6600]">{formatKWD(p.price)}</td>
                    <td className="p-3">
                      {editingId === p.id ? (
                        <input type="number" value={editStock} onChange={(e) => setEditStock(parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 rounded border border-gray-300 text-sm" autoFocus />
                      ) : (
                        <span className={status === "out" ? "text-red-600 font-bold" : status === "low" ? "text-yellow-600 font-semibold" : "text-gray-900"}>
                          {p.stock}
                        </span>
                      )}
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      {editingId === p.id ? (
                        <input type="number" value={editThreshold} onChange={(e) => setEditThreshold(parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 rounded border border-gray-300 text-sm" />
                      ) : (
                        <span className="text-gray-600 text-xs">{p.lowStockThreshold}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        status === "out" ? "bg-red-100 text-red-700" : status === "low" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                      }`}>
                        {status === "out" ? "Out" : status === "low" ? "Low" : "OK"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {editingId === p.id ? (
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => saveStock(p.id)} disabled={savingId === p.id} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 hover:bg-gray-50 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit stock">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
