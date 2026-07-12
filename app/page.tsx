import { getFeaturedProducts, getSaleProducts } from "@/lib/products";
import { CategoryShowcase } from "@/components/ui/category-showcase";
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
    <div className="pb-20 md:pb-0">
      {/* Mobile Hero Cover */}
      <div className="md:hidden relative h-48 sm:h-56 overflow-hidden">
        <img
          src="/images/site/cover.jpeg"
          alt="Pet Store Kuwait"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <img src="/logo.jpg" alt="Pet Store" className="h-10 w-auto object-contain mb-2 drop-shadow-lg" />
          <h2 className="text-lg font-bold drop-shadow-lg">
            Your Dependable Partner in PetHood
          </h2>
        </div>
      </div>

      {/* Categories — Horizontal scroll */}
      <section className="max-w-7xl mx-auto px-4 pt-5 pb-3">
        <h2 className="text-base font-bold text-gray-900 mb-3">Shop by Pet Type</h2>
        <CategoryShowcase locale="en" />
      </section>

      {/* Products directly */}
      <section className="max-w-7xl mx-auto px-4 pt-2 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">All Products</h2>
          <a href="/products" className="text-xs text-[#ff6600] hover:underline font-medium">View All →</a>
        </div>
        <ProductGrid products={uniqueProducts.length > 0 ? uniqueProducts : featured} />
      </section>
    </div>
  );
}
