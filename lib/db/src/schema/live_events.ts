import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const liveEventsTable = pgTable("live_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  isLive: boolean("is_live").notNull().default(false),
  viewerCount: integer("viewer_count").notNull().default(0),
  thumbnailUrl: text("thumbnail_url").notNull(),
  hostName: text("host_name").notNull(),
  featuredProducts: jsonb("featured_products").$type<number[]>().notNull().default([]),
});

export const liveFeedTable = pgTable("live_feed", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => liveEventsTable.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("chat"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLiveEventSchema = createInsertSchema(liveEventsTable).omit({ id: true });
export type InsertLiveEvent = z.infer<typeof insertLiveEventSchema>;
export type LiveEvent = typeof liveEventsTable.$inferSelect;

export const insertLiveFeedSchema = createInsertSchema(liveFeedTable).omit({ id: true, createdAt: true });
export type InsertLiveFeed = z.infer<typeof insertLiveFeedSchema>;
export type LiveFeedItem = typeof liveFeedTable.$inferSelect;
