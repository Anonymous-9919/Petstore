"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/store/page-header";
import { ProductGrid } from "@/components/store/product-grid";
import { FilterSortButton } from "@/components/store/filter-sort-button";
import { useUIStore } from "@/stores/ui-store";
import { CATEGORIES } from "@/lib/constants";

const MOCK_PRODUCTS: Record<string, Array<{
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  categorySlug: string;
  variant?: string;
  variantAr?: string;
  price: number;
  photo: string;
}>> = {};

function generateCategoryProducts(categorySlug: string) {
  return [
    {
      id: `${categorySlug}-1`,
      name: `Premium ${categorySlug.replace(/-/g, " ")} Product 1`,
      nameAr: `منتج ${categorySlug.replace(/-/g, " ")} ممتاز ١`,
      slug: `${categorySlug}-product-1`,
      categorySlug,
      variant: "Large",
      variantAr: "كبير",
      price: 3.5,
      photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
    },
    {
      id: `${categorySlug}-2`,
      name: `Premium ${categorySlug.replace(/-/g, " ")} Product 2`,
      nameAr: `منتج ${categorySlug.replace(/-/g, " ")} ممتاز ٢`,
      slug: `${categorySlug}-product-2`,
      categorySlug,
      variant: "Small",
      variantAr: "صغير",
      price: 2.0,
      photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
    },
    {
      id: `${categorySlug}-3`,
      name: `Standard ${categorySlug.replace(/-/g, " ")} Product 3`,
      nameAr: `منتج ${categorySlug.replace(/-/g, " ")} قياسي ٣`,
      slug: `${categorySlug}-product-3`,
      categorySlug,
      variant: "Medium",
      variantAr: "متوسط",
      price: 5.0,
      photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
    },
    {
      id: `${categorySlug}-4`,
      name: `Economy ${categorySlug.replace(/-/g, " ")} Product 4`,
      nameAr: `منتج ${categorySlug.replace(/-/g, " ")} اقتصادي ٤`,
      slug: `${categorySlug}-product-4`,
      categorySlug,
      price: 1.25,
      photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/17/ae/17ae187c42d53b5cfe0b622ff46bca95.jpg",
    },
  ];
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useUIStore();
  const isArabic = language === "ar";

  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryName = category
    ? isArabic
      ? category.nameAr
      : category.name
    : slug;
  const products = MOCK_PRODUCTS[slug] || generateCategoryProducts(slug);

  return (
    <div className="flex flex-col">
      <PageHeader title={categoryName} />
      <div className="px-3 py-2">
        <FilterSortButton />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
