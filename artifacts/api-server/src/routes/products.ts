import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, ilike, and, desc, asc, sql } from "drizzle-orm";

const router: IRouter = Router();

function toProductJson(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price as string),
    originalPrice: p.originalPrice ? parseFloat(p.originalPrice as string) : null,
    imageUrl: p.imageUrl,
    images: (p.images as string[]) || [],
    category: p.category,
    tags: (p.tags as string[]) || [],
    sizes: (p.sizes as string[]) || [],
    colors: (p.colors as string[]) || [],
    inStock: p.inStock,
    stockCount: p.stockCount,
    rating: parseFloat(p.rating as string),
    reviewCount: p.reviewCount,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isSale: p.isSale,
    lgbtqFriendly: p.lgbtqFriendly,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/products", async (req, res) => {
  const { category, search, sort, limit = "20", offset = "0" } = req.query as Record<string, string>;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.category, category));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));

  let query = db.select().from(productsTable).where(and(...conditions));

  const limitNum = Math.min(parseInt(limit) || 20, 100);
  const offsetNum = parseInt(offset) || 0;

  let products;
  if (sort === "price_asc") {
    products = await db.select().from(productsTable).where(and(...conditions)).orderBy(asc(productsTable.price)).limit(limitNum).offset(offsetNum);
  } else if (sort === "price_desc") {
    products = await db.select().from(productsTable).where(and(...conditions)).orderBy(desc(productsTable.price)).limit(limitNum).offset(offsetNum);
  } else if (sort === "popular") {
    products = await db.select().from(productsTable).where(and(...conditions)).orderBy(desc(productsTable.reviewCount)).limit(limitNum).offset(offsetNum);
  } else {
    products = await db.select().from(productsTable).where(and(...conditions)).orderBy(desc(productsTable.createdAt)).limit(limitNum).offset(offsetNum);
  }

  res.json(products.map(toProductJson));
});

router.get("/products/featured", async (_req, res) => {
  const products = await db.select().from(productsTable).where(eq(productsTable.isFeatured, true)).limit(8);
  res.json(products.map(toProductJson));
});

router.get("/products/categories", async (_req, res) => {
  const categories = await db.select().from(categoriesTable);
  res.json(categories);
});

router.get("/shop/summary", async (_req, res) => {
  const [totalCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable);
  const [newCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.isNew, true));
  const [saleCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.isSale, true));
  const [catCount] = await db.select({ count: sql<number>`count(*)` }).from(categoriesTable);

  const featured = await db.select().from(productsTable).where(eq(productsTable.isFeatured, true)).limit(6);
  const newArrivals = await db.select().from(productsTable).where(eq(productsTable.isNew, true)).orderBy(desc(productsTable.createdAt)).limit(6);
  const saleItems = await db.select().from(productsTable).where(eq(productsTable.isSale, true)).limit(6);

  res.json({
    totalProducts: parseInt(String(totalCount.count)),
    newArrivals: parseInt(String(newCount.count)),
    onSale: parseInt(String(saleCount.count)),
    categories: parseInt(String(catCount.count)),
    featuredProducts: featured.map(toProductJson),
    newArrivalsProducts: newArrivals.map(toProductJson),
    saleProducts: saleItems.map(toProductJson),
  });
});

router.get("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(toProductJson(product));
});

export default router;
