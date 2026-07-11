import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fromCSV, validateCSVFormat, PRODUCT_CSV_COLUMNS } from "@/lib/csv";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

// Minimum columns required for product CSV import
const MINIMUM_CSV_COLUMNS = ["sku", "name", "category", "petType", "price", "stock", "active"] as const;

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100);
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return false;
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function saveUploadedFile(file: File, dest: string): Promise<boolean> {
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length < 100) return false;
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    return true;
  } catch {
    return false;
  }
}

// Extract SKU from filename. Supports: SKU.jpg, SKU-1.jpg, SKU_1.jpg, SKU-1-extra.jpg
function extractSkuFromFilename(filename: string): string | null {
  const base = filename.replace(/\.[^.]+$/, ""); // remove extension
  // Match SKU followed by optional -N or _N suffix
  const m = base.match(/^([A-Za-z0-9][A-Za-z0-9_\-]{0,49})/);
  if (!m) return null;
  let sku = m[1];
  // Strip trailing -N or _N if present
  sku = sku.replace(/[-_]\d+$/, "");
  return sku || null;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "products";
  const mode = (url.searchParams.get("mode") || "upsert") as "upsert" | "create_only" | "update_only";

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const downloadImages = formData.get("downloadImages") === "1";

  if (!file) return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
  if (!["upsert", "create_only", "update_only"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode. Use: upsert, create_only, or update_only" }, { status: 400 });
  }

  const text = await file.text();

  if (type === "products") {
    // Flexible validation: only require the essential columns, not all 16
    const clean = text.replace(/^\uFEFF/, "");
    const firstLine = clean.split("\n")[0] || "";
    const headers = firstLine.split(",").map((h: string) => h.trim().replace(/^"|"$/g, ""));
    const missingEssential = (MINIMUM_CSV_COLUMNS as readonly string[]).filter((c) => !headers.includes(c));
    if (missingEssential.length > 0) {
      return NextResponse.json({
        error: `CSV missing required column(s): ${missingEssential.join(", ")}`,
        expectedColumns: [...MINIMUM_CSV_COLUMNS],
        missing: missingEssential,
        fix: "Export a fresh CSV from Products or Inventory page and edit only the data — do not change column headers.",
      }, { status: 400 });
    }
  }

  // Define which fields are truly required (values, not just column headers)
  // These must have non-empty values. All other fields get defaults if empty.
  const REQUIRED_VALUE_FIELDS = ["sku", "name", "category", "petType", "price", "stock", "active"] as const;

  const rows = fromCSV(text);
  if (rows.length === 0) return NextResponse.json({ error: "CSV has no data rows" }, { status: 400 });

  // Collect all uploaded image files (from the "images" multi-file field)
  const imageFiles: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (key === "images" && value instanceof File && value.size > 0) {
      imageFiles.push(value);
    }
  }

  // Build a map: SKU → array of {file, order}
  const skuImageMap = new Map<string, { file: File; order: number }[]>();
  for (const imgFile of imageFiles) {
    const sku = extractSkuFromFilename(imgFile.name);
    if (!sku) continue;
    // Extract order from filename (e.g., SKU-1.jpg → 1, SKU.jpg → 0)
    const base = imgFile.name.replace(/\.[^.]+$/, "");
    const orderMatch = base.match(/[-_](\d+)$/);
    const order = orderMatch ? parseInt(orderMatch[1]) : 0;
    if (!skuImageMap.has(sku)) skuImageMap.set(sku, []);
    skuImageMap.get(sku)!.push({ file: imgFile, order });
  }

  const results = {
    created: 0,
    updated: 0,
    skipped: 0,
    imagesDownloaded: 0,
    imagesUploaded: 0,
    branchStocksUpserted: 0,
    errors: [] as string[],
    mode,
    details: { created: [] as string[], updated: [] as string[], skipped: [] as string[] },
  };

  const branches = await prisma.branch.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  const branchInfo = branches.map((b) => ({ id: b.id, slug: slugify(b.name) }));

  for (const row of rows) {
    try {
      // Backward compatibility: accept price_kwd as alias for price
      if (!row.price && row.price_kwd) row.price = row.price_kwd;
      if (!row.originalPrice && row.originalPrice_kwd) row.originalPrice = row.originalPrice_kwd;
      // Handle stockStatus from inventory export
      if (row.stockStatus && !row.stock) {
        row.stock = row.stockStatus === "out_of_stock" ? "0" : row.stock || "0";
      }

      const sku = (row.sku || "").trim();
      const name = (row.name || "").trim();

      // Check required value fields first
      const missingRequired: string[] = [];
      if (!sku) missingRequired.push("sku");
      if (!name) missingRequired.push("name");
      if (type === "products") {
        if (!(row.category || "").trim() && !(row.categorySlug || "").trim()) missingRequired.push("category");
        if (!(row.petType || "").trim()) missingRequired.push("petType");
        if (row.price === "" || row.price === undefined) missingRequired.push("price");
        if (row.stock === "" || row.stock === undefined) missingRequired.push("stock");
        if (!(row.active || "").trim()) missingRequired.push("active");
      }
      if (missingRequired.length > 0) {
        results.skipped++;
        const label = name || sku || `row ${results.skipped + 1}`;
        results.details.skipped.push(`"${label}": missing required field(s): ${missingRequired.join(", ")}`);
        continue;
      }

      const existing = sku
        ? await prisma.product.findUnique({ where: { sku } }).catch(() => null)
        : null;

      if (mode === "create_only" && existing) {
        results.skipped++;
        results.details.skipped.push(`"${name}" (SKU: ${sku}): already exists — skipped (create_only mode)`);
        continue;
      }
      if (mode === "update_only" && !existing) {
        results.skipped++;
        results.details.skipped.push(`"${name}" (SKU: ${sku}): not found — skipped (update_only mode)`);
        continue;
      }

      // Resolve category
      let categoryId: string | null = null;
      const catSlug = (row.categorySlug || "").trim();
      const catName = (row.category || "").trim();
      if (catSlug || catName) {
        const cat = catSlug
          ? await prisma.category.findUnique({ where: { slug: catSlug } })
          : await prisma.category.findFirst({ where: { name: catName } });
        if (cat) categoryId = cat.id;
      }
      if (!categoryId) {
        const fallback = await prisma.category.findFirst();
        if (fallback) categoryId = fallback.id;
        else {
          results.skipped++;
          results.details.skipped.push(`"${name}": no category found — please create category "${catName || catSlug}" first`);
          continue;
        }
      }

      // Apply defaults for optional fields
      const slug = (row.slug || "").trim() || slugify(name) + "-" + Date.now() + Math.floor(Math.random() * 1000);
      const price = parseFloat(row.price || "0") || 0;
      const originalPrice = row.originalPrice ? parseFloat(row.originalPrice) : null;
      const stock = parseInt(row.stock || "0", 10) || 0;
      const lowStock = row.lowStockThreshold ? parseInt(row.lowStockThreshold, 10) || 5 : 5;
      const petType = (row.petType || "general").trim();
      const description = (row.description || "").trim();
      const descriptionAr = (row.descriptionAr || "").trim();
      const active = row.active !== "0";
      const featured = row.featured === "1";

      let product;
      if (existing) {
        product = await prisma.product.update({
          where: { id: existing.id },
          data: { name, nameAr: name, slug, price, originalPrice, stock, lowStockThreshold: lowStock, sku, petType, description, descriptionAr, categoryId, active, featured, hasVariants: false },
        });
        results.updated++;
        results.details.updated.push(`${name} (SKU: ${sku})`);
      } else {
        let uniqueSlug = slug;
        let n = 1;
        while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${slug}-${n++}`;
        }
        product = await prisma.product.create({
          data: { name, nameAr: name, slug: uniqueSlug, price, originalPrice, stock, lowStockThreshold: lowStock, sku, petType, description, descriptionAr, categoryId, active, featured, hasVariants: false, rating: 4.5, reviewCount: 0 },
        });
        results.created++;
        results.details.created.push(`${name} (SKU: ${sku})`);
      }

      // Handle images: priority = uploaded files matching SKU > CSV URLs
      if (type === "products") {
        await prisma.productImage.deleteMany({ where: { productId: product.id } });

        const allImages: { url: string; order: number }[] = [];

        // 1) Uploaded files matching this SKU
        if (sku && skuImageMap.has(sku)) {
          const skuImages = skuImageMap.get(sku)!;
          for (const { file: imgFile, order } of skuImages) {
            const ext = path.extname(imgFile.name) || ".jpg";
            const safeName = `${product.id}-${Date.now()}-${order}${ext}`;
            const dest = path.join(UPLOAD_DIR, safeName);
            const ok = await saveUploadedFile(imgFile, dest);
            if (ok) {
              allImages.push({ url: `/uploads/products/${safeName}`, order });
              results.imagesUploaded++;
            }
          }
        }

        // 2) URLs from CSV (pipe-separated)
        const imagesRaw = (row.images || "").trim();
        if (imagesRaw) {
          const urls: string[] = imagesRaw.split("|").map((u: string) => u.trim()).filter(Boolean);
          for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            let finalUrl = url;
            if (downloadImages && url.startsWith("http")) {
              const ext = path.extname(new URL(url).pathname) || ".jpg";
              const safeName = `${product.id}-${Date.now()}-url-${i}${ext}`;
              const dest = path.join(UPLOAD_DIR, safeName);
              const ok = await downloadImage(url, dest);
              if (ok) { finalUrl = `/uploads/products/${safeName}`; results.imagesDownloaded++; }
            }
            allImages.push({ url: finalUrl, order: 100 + i });
          }
        }

        // Sort by order and create records
        allImages.sort((a, b) => a.order - b.order);
        for (let i = 0; i < allImages.length; i++) {
          await prisma.productImage.create({ data: { productId: product.id, url: allImages[i].url, order: i } });
        }

        // Handle branch stock columns (branch_{slug}_stock, branch_{slug}_active)
        if (branchInfo.length > 0) {
          for (const branch of branchInfo) {
            const stockKey = `branch_${branch.slug}_stock`;
            const activeKey = `branch_${branch.slug}_active`;
            if (row[stockKey] !== undefined && row[stockKey] !== "") {
              const branchStock = parseInt(row[stockKey], 10);
              if (!isNaN(branchStock) && branchStock >= 0) {
                const branchActive = row[activeKey] !== "0" && row[activeKey] !== "no";
                await prisma.branchStock.upsert({
                  where: { branchId_productId: { branchId: branch.id, productId: product.id } },
                  update: { stock: branchStock, active: branchActive },
                  create: { branchId: branch.id, productId: product.id, stock: branchStock, active: branchActive },
                });
                results.branchStocksUpserted++;
              }
            }
          }
        }
      }
    } catch (e) {
      const err = `Row "${row.name || "?"}": ${e instanceof Error ? e.message : "Failed"}`;
      results.errors.push(err);
    }
  }

  return NextResponse.json(results);
}
