import { getFeaturedProducts, getSaleProducts } from "@/lib/products";
import { prisma } from "@/lib/db";
import HeroBanner from "@/components/home/hero-banner";
import CategoryShowcase from "@/components/ui/category-showcase";
import { ProductGrid } from "@/components/store/product-grid";

export const revalidate = 300;

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: [{ petType: "asc" }, { name: "asc" }],
  });
  const counts = await prisma.product.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
    where: { active: true },
  });
  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  return categories.map((c) => ({
    name: c.name,
    nameAr: c.nameAr,
    slug: c.slug,
    petType: c.petType,
    image: c.image,
    count: countMap.get(c.id) || 0,
  }));
}

export default async function HomePage() {
  const [featured, saleProducts, categories] = await Promise.all([
    getFeaturedProducts("en"),
    getSaleProducts("en"),
    getCategories(),
  ]);

  const allProducts = [...featured, ...saleProducts];
  const seen = new Set<string>();
  const uniqueProducts = allProducts.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return (
    <div className="pb-4">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories — Horizontal scroll like source */}
      <section className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Shop by Pet Type</h2>
        <CategoryShowcase locale="en" categories={categories} />
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Featured Products</h2>
            <a href="/products" className="text-xs text-[#ff6600] hover:underline font-medium">View All</a>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="px-4 pt-2 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">On Sale</h2>
            <a href="/products?sale=true" className="text-xs text-[#ff6600] hover:underline font-medium">View All</a>
          </div>
          <ProductGrid products={saleProducts} />
        </section>
      )}

      {/* All Products (if no featured or sale) */}
      {featured.length === 0 && saleProducts.length === 0 && (
        <section className="px-4 pt-2 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">All Products</h2>
            <a href="/products" className="text-xs text-[#ff6600] hover:underline font-medium">View All</a>
          </div>
          <ProductGrid products={uniqueProducts.length > 0 ? uniqueProducts : featured} />
        </section>
      )}
    </div>
  );
}
