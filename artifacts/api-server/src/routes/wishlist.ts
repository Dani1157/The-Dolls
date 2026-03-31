import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wishlistTable, productsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

function getSession(req: any): string {
  return req.cookies?.dolls_session || req.headers["x-session-id"] as string || "default-session";
}

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

router.get("/wishlist", async (req, res) => {
  const sessionId = getSession(req);
  const items = await db
    .select({ product: productsTable })
    .from(wishlistTable)
    .leftJoin(productsTable, eq(wishlistTable.productId, productsTable.id))
    .where(eq(wishlistTable.sessionId, sessionId));
  res.json(items.filter(i => i.product).map(i => toProductJson(i.product!)));
});

router.post("/wishlist", async (req, res) => {
  const sessionId = getSession(req);
  const { productId } = req.body;
  if (!productId) {
    res.status(400).json({ error: "productId required" });
    return;
  }
  try {
    await db.insert(wishlistTable).values({ sessionId, productId }).onConflictDoNothing();
  } catch (e) {
    // Already exists
  }
  res.json({ success: true });
});

router.delete("/wishlist/:productId", async (req, res) => {
  const sessionId = getSession(req);
  const productId = parseInt(req.params.productId);
  await db.delete(wishlistTable).where(and(eq(wishlistTable.sessionId, sessionId), eq(wishlistTable.productId, productId)));
  res.json({ success: true });
});

export default router;
