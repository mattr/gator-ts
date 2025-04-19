import { db } from "../index";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
  return result;
}

export async function deleteFeeds() {
  return db.delete(feeds).returning();
}

export async function getFeeds() {
  return db.select().from(feeds);
}
