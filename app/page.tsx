import { getFeaturedProducts, getSaleProducts } from "@/lib/products";
import CategoryShowcase from "@/components/ui/category-showcase";
import { ProductGrid } from "@/components/store/product-grid";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, saleProducts] = await Promise.all([
    getFeaturedProducts("en"),
    getSaleProducts("en"),
  ]);

  const allProducts = [...featured, ...saleProducts];
  const uniqueProducts = allProducts.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);

  return (
    <div className="pb-4">
      {/* Categories — Horizontal scroll like source */}
      <section className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Shop by Pet Type</h2>
        <CategoryShowcase locale="en" />
      </section>

      {/* Products directly like source */}
      <section className="px-4 pt-2 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">All Products</h2>
          <a href="/products" className="text-xs text-[#ff6600] hover:underline font-medium">View All</a>
        </div>
        <ProductGrid products={uniqueProducts.length > 0 ? uniqueProducts : featured} />
      </section>
    </div>
  );
}
