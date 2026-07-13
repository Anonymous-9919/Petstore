import type { Product, Category } from "@/types";

const PLACEHOLDER = "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", tenantId: "t-1", name: "Special Offer", nameAr: "عرض خاص", slug: "special-offer", photo: PLACEHOLDER, coverPhoto: null, order: 1, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-2", tenantId: "t-1", name: "Cat Wet Food", nameAr: "طعام رطب للقطط", slug: "cat-wet-food", photo: PLACEHOLDER, coverPhoto: null, order: 2, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-3", tenantId: "t-1", name: "Dog Wet Food", nameAr: "طعام رطب للكلاب", slug: "dog-wet-food", photo: PLACEHOLDER, coverPhoto: null, order: 3, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-4", tenantId: "t-1", name: "Cat Dry Food", nameAr: "الطعام الجاف للقطط", slug: "cat-dry-food", photo: PLACEHOLDER, coverPhoto: null, order: 4, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-5", tenantId: "t-1", name: "Dog Dry Food", nameAr: "الطعام الجاف للكلاب", slug: "dog-dry-food", photo: PLACEHOLDER, coverPhoto: null, order: 5, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-6", tenantId: "t-1", name: "Cat Treats", nameAr: "مكافأت القطط", slug: "cat-treats", photo: PLACEHOLDER, coverPhoto: null, order: 6, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-7", tenantId: "t-1", name: "Dog Treats", nameAr: "وجبات مكافأة للكلاب", slug: "dog-treats", photo: PLACEHOLDER, coverPhoto: null, order: 7, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-8", tenantId: "t-1", name: "Pets Carrier & Travel Bags", nameAr: "شنط واقفاص الحيوانات الأليفة", slug: "pet-carriers", photo: PLACEHOLDER, coverPhoto: null, order: 8, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-9", tenantId: "t-1", name: "Cat Litter and Boxes", nameAr: "تراب وصناديق للقطط", slug: "cat-litter", photo: PLACEHOLDER, coverPhoto: null, order: 9, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-10", tenantId: "t-1", name: "Pet Beds & Houses", nameAr: "منزل وسرائر الحيوانات الأليفة", slug: "pet-beds", photo: PLACEHOLDER, coverPhoto: null, order: 10, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-11", tenantId: "t-1", name: "Cat Accessories", nameAr: "اكسسوارات القطط", slug: "cat-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 11, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-12", tenantId: "t-1", name: "Dog Accessories", nameAr: "اكسسوارات الكلاب", slug: "dog-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 12, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-13", tenantId: "t-1", name: "Healthcare & Supplements", nameAr: "الرعاية الصحية والمكملات الغذائية", slug: "healthcare", photo: PLACEHOLDER, coverPhoto: null, order: 13, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-14", tenantId: "t-1", name: "Grooming & Hygiene", nameAr: "الحلاقة والنظافة", slug: "grooming", photo: PLACEHOLDER, coverPhoto: null, order: 14, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-15", tenantId: "t-1", name: "Cat Scratchers", nameAr: "خداشات القطط", slug: "cat-scratchers", photo: PLACEHOLDER, coverPhoto: null, order: 15, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-16", tenantId: "t-1", name: "Pet Cage", nameAr: "أقفاص الحيوانات الأليفة", slug: "pet-cage", photo: PLACEHOLDER, coverPhoto: null, order: 16, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-17", tenantId: "t-1", name: "Cat Toys", nameAr: "ألعاب القطط", slug: "cat-toys", photo: PLACEHOLDER, coverPhoto: null, order: 17, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-18", tenantId: "t-1", name: "Pet Milk", nameAr: "حليب القطط", slug: "pet-milk", photo: PLACEHOLDER, coverPhoto: null, order: 18, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-19", tenantId: "t-1", name: "Dog Toys", nameAr: "ألعاب الكلاب", slug: "dog-toys", photo: PLACEHOLDER, coverPhoto: null, order: 19, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-20", tenantId: "t-1", name: "Bird Food", nameAr: "طعام الطيور", slug: "bird-food", photo: PLACEHOLDER, coverPhoto: null, order: 20, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-21", tenantId: "t-1", name: "Bird Toys", nameAr: "ألعاب الطيور", slug: "bird-toys", photo: PLACEHOLDER, coverPhoto: null, order: 21, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-22", tenantId: "t-1", name: "Bird Cage", nameAr: "قفص الطيور والحامل", slug: "bird-cage", photo: PLACEHOLDER, coverPhoto: null, order: 22, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-23", tenantId: "t-1", name: "Bird Needs & Accessories", nameAr: "اكسسوارات واحتياجات الطيور", slug: "bird-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 23, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-24", tenantId: "t-1", name: "Rabbit Food", nameAr: "غذاء الأرانب", slug: "rabbit-food", photo: PLACEHOLDER, coverPhoto: null, order: 24, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-25", tenantId: "t-1", name: "Rabbit Needs & Accessories", nameAr: "احتياجات واكسسوارات الأرانب", slug: "rabbit-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 25, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-26", tenantId: "t-1", name: "Fish Food", nameAr: "طعام الأسماك", slug: "fish-food", photo: PLACEHOLDER, coverPhoto: null, order: 26, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-27", tenantId: "t-1", name: "Fish Needs & Accessories", nameAr: "احتياجات واكسسوارات الأسماك", slug: "fish-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 27, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-28", tenantId: "t-1", name: "Hamster Needs & Accessories", nameAr: "احتياجات واكسسوارات الهامستر", slug: "hamster-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 28, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-29", tenantId: "t-1", name: "Hamster Food", nameAr: "طعام الهامستر", slug: "hamster-food", photo: PLACEHOLDER, coverPhoto: null, order: 29, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-30", tenantId: "t-1", name: "Reptile Food", nameAr: "طعام الزواحف", slug: "reptile-food", photo: PLACEHOLDER, coverPhoto: null, order: 30, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
  { id: "cat-31", tenantId: "t-1", name: "Reptile Needs & Accessories", nameAr: "احتياجات واكسسوارات الزواحف", slug: "reptile-accessories", photo: PLACEHOLDER, coverPhoto: null, order: 31, description: "", arDescription: "", parentId: null, isActive: true, hasPassword: false, subCategories: [] },
];

const IMAGES = [
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/17/ae/17ae187c42d53b5cfe0b622ff46bca95.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/05/43/05438444f1060c19f77dcb86583491ed.jpg",
];

function genProducts(categorySlug: string, count: number = 8): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${categorySlug}-${i + 1}`,
    tenantId: "t-1",
    categoryId: `cat-${categorySlug}`,
    name: `${categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Product ${i + 1}`,
    nameAr: `منتج ${i + 1} - ${categorySlug}`,
    slug: `${categorySlug}-product-${i + 1}`,
    description: `Premium quality product for your beloved pets. Category: ${categorySlug}.`,
    arDescription: `منتج عالي الجودة لحيواناتك الأليفة. الفئة: ${categorySlug}.`,
    price: parseFloat((0.5 + Math.random() * 20).toFixed(3)),
    comparePrice: Math.random() > 0.5 ? parseFloat((1 + Math.random() * 25).toFixed(3)) : null,
    photo: IMAGES[i % IMAGES.length],
    photos: [IMAGES[i % IMAGES.length], IMAGES[(i + 1) % IMAGES.length]],
    sku: `SKU-${categorySlug.toUpperCase().slice(0, 4)}-${String(i + 1).padStart(4, "0")}`,
    isActive: true,
    hasVariants: i % 3 === 0,
    specialRequestsEnabled: true,
  }));
}

const productsByCategory: Record<string, Product[]> = {};
for (const cat of MOCK_CATEGORIES) {
  productsByCategory[cat.slug] = genProducts(cat.slug);
}

export { productsByCategory };

export function getAllProducts(): Product[] {
  return Object.values(productsByCategory).flat();
}

export function getProductsByCategory(slug: string): Product[] {
  return productsByCategory[slug] || [];
}

export function getProductBySlug(categorySlug: string, productSlug: string): Product | undefined {
  const products = productsByCategory[categorySlug];
  return products?.find((p) => p.slug === productSlug);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return getAllProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameAr.includes(query) ||
      p.description.toLowerCase().includes(q)
  );
}
