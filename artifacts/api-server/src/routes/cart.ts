import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

function getSessionId(req: any): string {
  if (!req.session?.id) {
    if (!req.cookies?.sessionId) {
      const id = Math.random().toString(36).slice(2);
      req.sessionId = id;
      return id;
    }
    return req.cookies.sessionId;
  }
  return req.session.id;
}

function getSession(req: any): string {
  return req.cookies?.dolls_session || req.headers["x-session-id"] as string || "default-session";
}

async function buildCart(sessionId: string) {
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      size: cartItemsTable.size,
      color: cartItemsTable.color,
      product: productsTable,
    })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const cartItems = items.map(item => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    product: item.product ? {
      id: item.product.id,
      name: item.product.name,
      description: item.product.description,
      price: parseFloat(item.product.price as string),
      originalPrice: item.product.originalPrice ? parseFloat(item.product.originalPrice as string) : null,
      imageUrl: item.product.imageUrl,
      images: (item.product.images as string[]) || [],
      category: item.product.category,
      tags: (item.product.tags as string[]) || [],
      sizes: (item.product.sizes as string[]) || [],
      colors: (item.product.colors as string[]) || [],
      inStock: item.product.inStock,
      stockCount: item.product.stockCount,
      rating: parseFloat(item.product.rating as string),
      reviewCount: item.product.reviewCount,
      isFeatured: item.product.isFeatured,
      isNew: item.product.isNew,
      isSale: item.product.isSale,
      lgbtqFriendly: item.product.lgbtqFriendly,
      createdAt: item.product.createdAt.toISOString(),
    } : null,
  }));

  const subtotal = cartItems.reduce((sum, item) => {
    const price = (item.product?.price || 0) * item.quantity;
    return sum + price;
  }, 0);

  return {
    items: cartItems,
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(subtotal * 100) / 100,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}

router.get("/cart", async (req, res) => {
  const sessionId = getSession(req);
  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.post("/cart", async (req, res) => {
  const sessionId = getSession(req);
  const { productId, quantity, size, color } = req.body;

  if (!productId || !quantity) {
    res.status(400).json({ error: "productId and quantity required" });
    return;
  }

  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(and(
      eq(cartItemsTable.sessionId, sessionId),
      eq(cartItemsTable.productId, productId),
    ));

  if (existing.length > 0) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItemsTable.id, existing[0].id));
  } else {
    await db.insert(cartItemsTable).values({ sessionId, productId, quantity, size, color });
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.put("/cart/:itemId", async (req, res) => {
  const sessionId = getSession(req);
  const itemId = parseInt(req.params.itemId);
  const { quantity } = req.body;

  if (quantity <= 0) {
    await db.delete(cartItemsTable).where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.sessionId, sessionId)));
  } else {
    await db.update(cartItemsTable).set({ quantity }).where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.sessionId, sessionId)));
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.delete("/cart/:itemId", async (req, res) => {
  const sessionId = getSession(req);
  const itemId = parseInt(req.params.itemId);
  await db.delete(cartItemsTable).where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.sessionId, sessionId)));
  const cart = await buildCart(sessionId);
  res.json(cart);
});

export default router;
