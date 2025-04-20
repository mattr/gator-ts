import { type Post, posts } from "../schema";
import { db } from "../index";
import { getFeedFollowsForUser } from "./feed-follows";
import { desc, inArray } from "drizzle-orm";

export async function createPost(post: Post): Promise<Post> {
  const [result] = await db.insert(posts).values({ ...post }).returning();
  return result;
}

export async function getPostsForUser(userId: string, numPosts: number): Promise<Post[]> {
  const follows = await getFeedFollowsForUser(userId);
  const feedIds = follows.map((f) => f.feedId);
  return db
    .select()
    .from(posts)
    .where(inArray(posts.feedId, feedIds))
    .orderBy(desc(posts.publishedAt))
    .limit(numPosts);
}
