import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  slogan: varchar("slogan", { length: 500 }),
  sloganAr: varchar("slogan_ar", { length: 500 }),
  logo: varchar("logo", { length: 500 }),
  logoAr: varchar("logo_ar", { length: 500 }),
  cover: varchar("cover", { length: 500 }),
  domain: varchar("domain", { length: 255 }),
  settings: jsonb("settings").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const branches = pgTable("branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull(),
  photo: varchar("photo", { length: 500 }),
  coverPhoto: varchar("cover_photo", { length: 500 }),
  order: integer("order").default(0),
  description: text("description"),
  arDescription: text("ar_description"),
  parentId: uuid("parent_id"),
  isActive: boolean("is_active").default(true).notNull(),
  hasPassword: boolean("has_password").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  nameAr: varchar("name_ar", { length: 500 }),
  slug: varchar("slug", { length: 500 }).notNull(),
  description: text("description"),
  arDescription: text("ar_description"),
  price: decimal("price", { precision: 10, scale: 3 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 10, scale: 3 }),
  photo: varchar("photo", { length: 500 }),
  photos: jsonb("photos").$type<string[]>().default([]),
  sku: varchar("sku", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  hasVariants: boolean("has_variants").default(false),
  specialRequestsEnabled: boolean("special_requests_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 3 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  stock: integer("stock").default(0),
  weight: varchar("weight", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  variantId: uuid("variant_id"),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  quantity: integer("quantity").default(0),
  reserved: integer("reserved").default(0),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  defaultAddressId: uuid("default_address_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  label: varchar("label", { length: 255 }),
  area: varchar("area", { length: 255 }),
  block: varchar("block", { length: 50 }),
  street: varchar("street", { length: 255 }),
  building: varchar("building", { length: 100 }),
  flat: varchar("flat", { length: 50 }),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  isDefault: boolean("is_default").default(false),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  branchId: uuid("branch_id").references(() => branches.id),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 3 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 3 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 3 }).default("0"),
  total: decimal("total", { precision: 10, scale: 3 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  deliveryMode: varchar("delivery_mode", { length: 50 }),
  deliveryAddressId: uuid("delivery_address_id"),
  specialRemarks: text("special_remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  variantId: uuid("variant_id"),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 3 }).notNull(),
  total: decimal("total", { precision: 10, scale: 3 }).notNull(),
});

export const promotions = pgTable("promotions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  value: decimal("value", { precision: 10, scale: 3 }).notNull(),
  minOrder: decimal("min_order", { precision: 10, scale: 3 }).default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
});

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  code: varchar("code", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  value: decimal("value", { precision: 10, scale: 3 }).notNull(),
  minOrder: decimal("min_order", { precision: 10, scale: 3 }).default("0"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
});

export const deliveryZones = pgTable("delivery_zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  minDistance: decimal("min_distance", { precision: 10, scale: 2 }),
  maxDistance: decimal("max_distance", { precision: 10, scale: 2 }),
  fee: decimal("fee", { precision: 10, scale: 3 }).notNull(),
  isActive: boolean("is_active").default(true),
});

export const cmsPages = pgTable("cms_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  content: text("content"),
  isPublished: boolean("is_published").default(true),
});
