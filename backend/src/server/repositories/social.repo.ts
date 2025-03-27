import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { followers } from "@/db/schemas/social.schema";
import { eq, or } from "drizzle-orm";

/**
 * Get a user object from the database by their ID
 * @param userId - the ID of the user
 * @returns the user object or null if the user does not exist
 */
export const getUserById = (userId: string) =>
  db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

/**
 * Get a user's profile social stats
 * @param userId - the ID of the user
 * @returns the user's profile social stats
 */
export const getUserProfileSocialStats = async (userId: string) => {
  const [socialStats] = await db
    .select({
      userId: users.id,
      followersCount: db.$count(followers, eq(followers.followedId, users.id)),
      followingCount: db.$count(followers, eq(followers.followerId, users.id)),
      postsCount: db.$count(posts, eq(posts.ownerId, users.id)),
    })
    .from(users)
    .leftJoin(posts, eq(users.id, posts.ownerId))
    .leftJoin(followers, or(eq(users.id, followers.followerId), eq(users.id, followers.followedId)))
    .where(eq(users.id, userId))
    .groupBy(users.id);

  if (!socialStats) return null;

  return socialStats;
};

export const getProfilePreview = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) return null;
};

export default {
  getUserById,
  getProfilePreview,
  getUserProfileSocialStats,
};
