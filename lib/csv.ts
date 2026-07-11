// lib/csv.ts — CSV serialization/parsing with proper UTF-8 BOM for Excel compatibility

// UTF-8 BOM (Byte Order Mark) — makes Excel detect UTF-8 encoding correctly
// so Arabic, Chinese, etc. display properly when opening the CSV.
const UTF8_BOM = "\uFEFF";

export function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return UTF8_BOM;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown): string => {
    if (v == null) return "";
    const s = String(v);
    // Always quote strings that contain special chars
    if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return UTF8_BOM + lines.join("\r\n");
}

export function fromCSV(text: string): Record<string, string>[] {
  // Strip BOM if present
  const clean = text.replace(/^\uFEFF/, "");
  const rows: Record<string, string>[] = [];
  const lines = parseCSVLines(clean);
  if (lines.length === 0) return [];
  const headers = lines[0].map((h) => h.trim());
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i];
    if (values.length === 1 && values[0] === "") continue;
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] || "").trim();
    }
    rows.push(row);
  }
  return rows;
}

function parseCSVLines(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { cur.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows;
}

// Define the strict CSV format contract
export const PRODUCT_CSV_COLUMNS = [
  "sku", "name", "nameAr", "slug", "category", "categoryAr", "petType",
  "price", "originalPrice", "stock", "lowStockThreshold",
  "description", "descriptionAr", "images", "active", "featured",
] as const;

export const INVENTORY_CSV_COLUMNS = [
  "id", "sku", "name", "nameAr", "category", "categoryAr", "categorySlug",
  "petType", "price_kwd", "originalPrice_kwd", "stock", "lowStockThreshold",
  "stockStatus", "active", "featured", "hasVariants", "rating", "reviewCount",
  "description", "descriptionAr", "createdAt",
] as const;

export type ProductCSVRow = Record<(typeof PRODUCT_CSV_COLUMNS)[number], string>;

// Validate CSV against the strict format contract
export function validateCSVFormat(
  text: string,
  expectedColumns: readonly string[],
  formatName: string
): { valid: boolean; error?: string; missing?: string[]; extra?: string[] } {
  const clean = text.replace(/^\uFEFF/, "");
  const lines = parseCSVLines(clean);
  if (lines.length === 0) {
    return { valid: false, error: `${formatName} CSV is empty` };
  }

  const headers = lines[0].map((h) => h.trim());
  const missing = expectedColumns.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    return {
      valid: false,
      error: `${formatName} CSV format mismatch. Missing required column(s): ${missing.join(", ")}`,
      missing,
    };
  }

  // Check for extra columns (warning only, not a failure)
  const extra = headers.filter((h) => !expectedColumns.includes(h));
  return { valid: true, extra: extra.length > 0 ? extra : undefined };
}
