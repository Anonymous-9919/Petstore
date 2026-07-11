import { prisma } from "@/lib/db";
import { formatKWD } from "@/lib/utils";
import Link from "next/link";
import { Plus, Search, Download, Upload } from "@/lib/icons";
import { ProductsClient } from "@/components/admin/products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const perPage = 20;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { nameAr: { contains: q } },
          { sku: { contains: q } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, nameAr: true } },
        images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/api/admin/export?type=products" className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg">
            <Download className="w-4 h-4" /> Export CSV
          </a>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#e55b00] text-white text-sm font-semibold px-4 py-2.5 rounded-lg w-fit"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      <form className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg">Search</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <ProductsClient
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            nameAr: p.nameAr,
            slug: p.slug,
            price: p.price,
            originalPrice: p.originalPrice,
            stock: p.stock,
            lowStockThreshold: p.lowStockThreshold,
            featured: p.featured,
            active: p.active,
            onSale: (p.originalPrice !== null && p.originalPrice > p.price),
            category: p.category,
            images: p.images,
          }))}
          total={total}
          currentPage={pageNum}
          totalPages={totalPages}
          searchQuery={q}
        />
      </div>
    </div>
  );
}
