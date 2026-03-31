import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { liveEventsTable, liveFeedTable, productsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

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

router.get("/live/events", async (_req, res) => {
  const events = await db.select().from(liveEventsTable).orderBy(desc(liveEventsTable.startsAt));
  res.json(events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt.toISOString(),
    isLive: e.isLive,
    viewerCount: e.viewerCount,
    thumbnailUrl: e.thumbnailUrl,
    hostName: e.hostName,
    featuredProducts: (e.featuredProducts as number[]) || [],
  })));
});

router.get("/live/current", async (_req, res) => {
  const [event] = await db.select().from(liveEventsTable).where(eq(liveEventsTable.isLive, true)).limit(1);

  if (!event) {
    res.json({ event: null, products: [], feed: [] });
    return;
  }

  const productIds = (event.featuredProducts as number[]) || [];
  let products: any[] = [];
  if (productIds.length > 0) {
    products = await db.select().from(productsTable).where(eq(productsTable.isFeatured, true)).limit(4);
  }

  const feed = await db.select().from(liveFeedTable).where(eq(liveFeedTable.eventId, event.id)).orderBy(desc(liveFeedTable.createdAt)).limit(20);

  res.json({
    event: {
      id: event.id,
      title: event.title,
      description: event.description,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      isLive: event.isLive,
      viewerCount: event.viewerCount,
      thumbnailUrl: event.thumbnailUrl,
      hostName: event.hostName,
      featuredProducts: (event.featuredProducts as number[]) || [],
    },
    products: products.map(toProductJson),
    feed: feed.map(f => ({
      id: f.id,
      username: f.username,
      message: f.message,
      type: f.type,
      createdAt: f.createdAt.toISOString(),
    })),
  });
});

router.get("/live/feed", async (_req, res) => {
  const [event] = await db.select().from(liveEventsTable).where(eq(liveEventsTable.isLive, true)).limit(1);

  if (!event) {
    res.json([]);
    return;
  }

  const feed = await db.select().from(liveFeedTable).where(eq(liveFeedTable.eventId, event.id)).orderBy(desc(liveFeedTable.createdAt)).limit(30);

  res.json(feed.map(f => ({
    id: f.id,
    username: f.username,
    message: f.message,
    type: f.type,
    createdAt: f.createdAt.toISOString(),
  })));
});

export default router;
