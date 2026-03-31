import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, cartItemsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function getSession(req: any): string {
  return req.cookies?.dolls_session || req.headers["x-session-id"] as string || "default-session";
}

router.get("/orders", async (req, res) => {
  const sessionId = getSession(req);
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.sessionId, sessionId));
  res.json(orders.map(o => ({
    id: o.id,
    status: o.status,
    items: o.items,
    total: parseFloat(o.total as string),
    shippingAddress: o.shippingAddress,
    createdAt: o.createdAt.toISOString(),
  })));
});

router.post("/orders", async (req, res) => {
  const sessionId = getSession(req);
  const { shippingAddress, email } = req.body;

  if (!shippingAddress || !email) {
    res.status(400).json({ error: "shippingAddress and email required" });
    return;
  }

  const cartItems = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.quantity * 50, 0);

  const [order] = await db.insert(ordersTable).values({
    sessionId,
    status: "pending",
    items: cartItems,
    total: String(total),
    shippingAddress,
    email,
  }).returning();

  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

  res.status(201).json({
    id: order.id,
    status: order.status,
    items: order.items,
    total: parseFloat(order.total as string),
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
  });
});

export default router;
