// prisma/seed.mjs — Fast bulk import
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

const ROOT = path.resolve(process.cwd());
const PRODUCTS_JSON = path.join(ROOT, "data", "products.json");
const CATEGORIES_JSON = path.join(ROOT, "data", "categories.json");
const BRANCHES_JSON = path.join(ROOT, "data", "branches.json");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

function decode(s) {
  if (typeof s !== "string" || !s) return s || "";
  if (/[\u0600-\u06FF]/.test(s)) return s;
  if (!/[\u0080-\u00FF]/.test(s)) return s;
  try {
    const buf = Buffer.from(s, "latin1");
    const d = buf.toString("utf-8");
    if (/[\u0600-\u06FF]/.test(d)) return d;
  } catch (_) {}
  return s;
}

async function main() {
  console.log("🌱 Seeding...\n");

  // Admin users
  const hash = hashPassword("Admin123!");
  for (const [email, name, role] of [
    ["admin@petstorekw.com", "Store Owner", "OWNER"],
    ["manager@petstorekw.com", "Store Manager", "MANAGER"],
    ["staff@petstorekw.com", "Store Staff", "STAFF"],
  ]) {
    await prisma.adminUser.upsert({
      where: { email },
      update: { passwordHash: hash, role },
      create: { email, passwordHash: hash, name, role },
    });
  }
  console.log("  ✓ 3 admin users");

  // Branches
  const branches = JSON.parse(fs.readFileSync(BRANCHES_JSON, "utf-8"));
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.branch.createMany({
    data: branches.map((b) => ({
      id: b.id,
      name: b.name,
      nameAr: decode(b.nameAr || b.name),
      address: b.address,
      addressAr: decode(b.addressAr || b.address),
      phone: Array.isArray(b.phone) ? b.phone.join(", ") : String(b.phone || ""),
      hours: b.hours,
      hoursAr: decode(b.hoursAr || b.hours),
      lat: b.lat,
      lng: b.lng,
      active: true,
    })),
  });
  console.log(`  ✓ ${branches.length} branches`);

  // Categories
  const cats = JSON.parse(fs.readFileSync(CATEGORIES_JSON, "utf-8"));
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: cats.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameAr: decode(c.nameAr || c.name),
      petType: c.petType,
      image: c.image,
      active: true,
    })),
  });
  console.log(`  ✓ ${cats.length} categories`);

  // Products - bulk with single createMany after lookup
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf-8"));
  const catMap = new Map((await prisma.category.findMany()).map((c) => [c.slug, c.id]));
  const productData = [];
  const productImageData = [];
  let pid = 0;
  for (const p of products) {
    const catId = catMap.get(p.categorySlug);
    if (!catId) continue;
    const id = `prod_${++pid}`;
    productData.push({
      id,
      slug: p.slug || `p-${p.id}`,
      name: p.name,
      nameAr: decode(p.nameAr || p.name),
      description: p.description || "",
      descriptionAr: decode(p.descriptionAr || ""),
      price: p.price,
      originalPrice: p.originalPrice || null,
      stock: 50,
      lowStockThreshold: 5,
      petType: p.petType,
      featured: !!p.featured,
      active: p.inStock !== false,
      hasVariants: !!p.hasVariants,
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 0,
      categoryId: catId,
    });
    const imgs = (p.images || []).filter((u) => u && (u.startsWith("/") || u.startsWith("http"))).slice(0, 5);
    for (let i = 0; i < imgs.length; i++) {
      productImageData.push({ productId: id, url: imgs[i], order: i });
    }
  }
  // Insert in chunks
  for (let i = 0; i < productData.length; i += 200) {
    await prisma.product.createMany({ data: productData.slice(i, i + 200) });
  }
  for (let i = 0; i < productImageData.length; i += 500) {
    await prisma.productImage.createMany({ data: productImageData.slice(i, i + 500) });
  }
  console.log(`  ✓ ${productData.length} products (${productImageData.length} images)`);

  // Settings
  const settings = {
    "store.name": "Pet Store Kuwait",
    "store.tagline": "Your Dependable Partner in PetHood",
    "store.email": "info@petstorekw.com",
    "store.phone": "+965 22207053",
    "store.whatsapp": "+965 98805010",
    "store.instagram": "https://instagram.com/petstore.kw",
    "store.facebook": "https://facebook.com/petstorekuwait",
    "store.taxRate": "0",
    "store.currency": "KWD",
    "delivery.freeThreshold": "10",
    "delivery.fee": "1",
    "delivery.estimatedTime": "30-60 min",
  };
  await prisma.setting.deleteMany();
  await prisma.setting.createMany({
    data: Object.entries(settings).map(([key, value]) => ({ key, value: JSON.stringify(value) })),
  });
  console.log(`  ✓ ${Object.keys(settings).length} settings`);

  // Content
  const content = {
    "home.hero.title": { en: "Everything Your", ar: "كل ما يحتاجه" },
    "home.hero.subtitle": {
      en: "Premium pet food, toys, accessories & care products. Fast delivery across Kuwait or pickup from our 3 branches.",
      ar: "أطعمة ومستلزمات حيوانات أليفة مميزة. توصيل سريع في الكويت أو استلام من فروعنا.",
    },
  };
  await prisma.contentBlock.deleteMany();
  await prisma.contentBlock.createMany({
    data: Object.entries(content).map(([key, value]) => ({ key, value: JSON.stringify(value) })),
  });

  // Notifications
  await prisma.notification.deleteMany();
  await prisma.notification.createMany({
    data: [
      { type: "system", title: "Welcome!", message: "Your admin dashboard is ready. Default login: admin@petstorekw.com / Admin123!" },
    ],
  });

  console.log("\n✅ Seed complete!\n");
}

main()
  .catch((e) => {
    console.error("Seed error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
