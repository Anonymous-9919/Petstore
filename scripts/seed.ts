import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { CATEGORIES, STORE, BRANCHES } from "../src/lib/constants";

const PLACEHOLDER = "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg";
const IMAGES = [
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/17/ae/17ae187c42d53b5cfe0b622ff46bca95.jpg",
  "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/05/43/05438444f1060c19f77dcb86583491ed.jpg",
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set. Please configure your .env.local");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // 1. Create tenant
  console.log("Creating tenant...");
  const [tenant] = await db
    .insert(schema.tenants)
    .values({
      name: STORE.name,
      nameAr: STORE.nameAr,
      slug: STORE.slug,
      slogan: STORE.slogan,
      sloganAr: STORE.sloganAr,
      logo: STORE.logo,
      logoAr: STORE.logoAr,
      cover: STORE.cover,
      domain: STORE.domain,
      settings: {
        enablePickup: true,
        enableDelivery: true,
        enableSearch: true,
        enablePromotions: true,
        enableCoupons: true,
        enableVariants: true,
        enableSpecialRemarks: true,
        enableQuickAddToCart: true,
        enableFilterAndSort: true,
        minimumOrder: 2,
        defaultLanguage: "en",
        branchCount: 2,
        dark: "#ff6600",
      },
    })
    .returning();
  console.log(`  Tenant created: ${tenant.id}`);

  // 2. Create branches
  console.log("Creating branches...");
  for (const branch of BRANCHES) {
    await db.insert(schema.branches).values({
      tenantId: tenant.id,
      name: branch.name,
      nameAr: branch.nameAr,
      address: branch.name,
      phone: STORE.phone,
      lat: "29.3117",
      lng: "47.4818",
      isActive: true,
    });
  }
  console.log(`  ${BRANCHES.length} branches created`);

  // 3. Create categories
  console.log("Creating categories...");
  const categoryIds: Record<string, string> = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const [inserted] = await db
      .insert(schema.categories)
      .values({
        tenantId: tenant.id,
        name: cat.name,
        nameAr: cat.nameAr,
        slug: cat.slug,
        photo: PLACEHOLDER,
        order: i + 1,
        description: `Shop ${cat.name} online in Kuwait`,
        arDescription: `تسوق ${cat.nameAr} أونلاين في الكويت`,
        isActive: true,
        hasPassword: false,
      })
      .returning();
    categoryIds[cat.slug] = inserted.id;
  }
  console.log(`  ${CATEGORIES.length} categories created`);

  // 4. Create sample products for each category
  console.log("Creating products...");
  let totalProducts = 0;
  for (const cat of CATEGORIES) {
    const catId = categoryIds[cat.slug];
    const productCount = 5 + Math.floor(Math.random() * 6);

    for (let i = 1; i <= productCount; i++) {
      const photoIndex = (totalProducts + i) % IMAGES.length;
      const price = parseFloat((0.5 + Math.random() * 20).toFixed(3));
      const hasCompare = Math.random() > 0.5;
      const [product] = await db
        .insert(schema.products)
        .values({
          tenantId: tenant.id,
          categoryId: catId,
          name: `${cat.name} Product ${i}`,
          nameAr: `منتج ${cat.nameAr} ${i}`,
          slug: `${cat.slug}-product-${i}`,
          description: `Premium ${cat.name.toLowerCase()} product for your beloved pets. High quality ingredients and materials.`,
          arDescription: `منتج ${cat.nameAr} عالي الجودة لحيواناتك الأليفة. مكونات ومواد عالية الجودة.`,
          price: price.toFixed(3),
          comparePrice: hasCompare ? parseFloat((price + 1 + Math.random() * 5).toFixed(3)).toFixed(3) : null,
          photo: IMAGES[photoIndex],
          photos: [IMAGES[photoIndex], IMAGES[(photoIndex + 1) % IMAGES.length]],
          sku: `SKU-${cat.slug.toUpperCase().slice(0, 6)}-${String(i).padStart(4, "0")}`,
          isActive: true,
          hasVariants: i % 3 === 0,
          specialRequestsEnabled: true,
        })
        .returning();

      // Create variants for some products
      if (i % 3 === 0) {
        const sizes = ["Small", "Medium", "Large"];
        const sizesAr = ["صغير", "متوسط", "كبير"];
        const weights = ["100g", "250g", "500g"];
        for (let v = 0; v < sizes.length; v++) {
          const variantPrice = price * (0.8 + v * 0.3);
          await db.insert(schema.productVariants).values({
            productId: product!.id,
            name: `${sizes[v]} - ${weights[v]}`,
            nameAr: `${sizesAr[v]} - ${weights[v]}`,
            price: variantPrice.toFixed(3),
            sku: `SKU-${cat.slug.toUpperCase().slice(0, 6)}-${String(i).padStart(4, "0")}-${sizes[v].charAt(0)}`,
            stock: Math.floor(Math.random() * 50),
            weight: weights[v],
            isActive: true,
          });
        }
      }

      totalProducts++;
    }
  }
  console.log(`  ${totalProducts} products created`);

  console.log("\nSeeding complete!");
  console.log(`  Tenant: ${STORE.name} (${tenant.id})`);
  console.log(`  Categories: ${CATEGORIES.length}`);
  console.log(`  Products: ${totalProducts}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
