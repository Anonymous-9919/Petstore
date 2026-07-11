import { prisma } from "@/lib/db";
import { HeroBanner } from "@/components/store/hero-banner";
import { getFeaturedProducts, getSaleProducts, getCategories, getBranches } from "@/lib/products";
import { CategoryShowcase } from "@/components/ui/category-showcase";
import { TrustBadges } from "@/components/ui/trust-badges";
import { FeaturedCarousel } from "@/components/ui/featured-carousel";
import { HomeSections } from "@/components/store/home-sections";
import { ProductGrid } from "@/components/store/product-grid";
import { BranchesGrid } from "@/components/store/branches-grid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [activeBanner, featured, saleProducts, categories, branches] = await Promise.all([
    prisma.banner.findFirst({ where: { active: true, position: "hero" }, orderBy: { order: "asc" } }),
    getFeaturedProducts("en"),
    getSaleProducts("en"),
    getCategories("en"),
    getBranches(),
  ]);

  return (
    <div>
      <HeroBanner
        imageUrl={activeBanner?.imageUrl || "/images/site/cover.jpeg"}
        title={activeBanner?.title || "Everything Your Pet Needs"}
        subtitle={activeBanner?.subtitle || "Premium pet food, toys, accessories & care products. Fast delivery across Kuwait or pickup from our 3 branches."}
        link={activeBanner?.link || "/products"}
      />

      <HomeSections
        categories={
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shop by Pet Type</h2>
            <CategoryShowcase locale="en" />
          </div>
        }
        featured={
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <a href="/products" className="text-sm text-[#ff6600] hover:underline hidden sm:block">View All →</a>
            </div>
            <FeaturedCarousel products={featured} locale="en" />
          </div>
        }
        trustBadges={<TrustBadges locale="en" />}
        saleProducts={
          saleProducts.length > 0 ? (
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">On Sale</h2>
                <a href="/products?sale=true" className="text-sm text-[#ff6600] hover:underline hidden sm:block">View All →</a>
              </div>
              <ProductGrid products={saleProducts} />
            </div>
          ) : null
        }
        branches={
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Branches</h2>
              <a href="/locations" className="text-sm text-[#ff6600] hover:underline hidden sm:block">View All →</a>
            </div>
            <BranchesGrid branches={branches} />
          </div>
        }
      />
    </div>
  );
}
