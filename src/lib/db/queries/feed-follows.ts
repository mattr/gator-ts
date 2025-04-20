import { db } from "../index";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({ userId, feedId }).returning();
  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .where(eq(feedFollows.id, newFeedFollow.id))
  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  return db.select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .where(eq(feedFollows.userId, userId))
}
