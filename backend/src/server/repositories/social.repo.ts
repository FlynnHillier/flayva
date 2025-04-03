import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { followers } from "@/db/schemas/social.schema";
import { User } from "@flayva-monorepo/shared/types";
import { and, eq, or, sql, asc } from "drizzle-orm";

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

export const createFollower = async (followerId: string, followedId: string) =>
  db
    .insert(followers)
    .values({
      followerId,
      followedId,
    })
    .onConflictDoNothing()
    .returning();

export const deleteFollower = async (followerId: string, followedId: string) => {
  const [result] = await db
    .delete(followers)
    .where(and(eq(followers.followedId, followedId), eq(followers.followerId, followerId)))
    .returning();

  return result as typeof result | null;
};
export const isFollowing = async (followerId: string, followedId: string) => {
  const follower = await db.query.followers.findFirst({
    where: (f, { eq, and }) => and(eq(f.followerId, followerId), eq(f.followedId, followedId)),
  });

  return !!follower;
};

export const getUserAvatarCloudFileKey = async (userId: string) => {
  const result = await getUserById(userId);

  return result && result.profile_picture_url;
};

export const updateUser = async (userId: string, data: Partial<Omit<User, "id">>) => {
  const [result] = await db.update(users).set(data).where(eq(users.id, userId)).returning();

  return result as typeof result | null;
};

/**
 * Get a list of users based on their username that are similar to the search query. Uses pagination
 * @param username - The username of a user in a search query
 * @param pageSize - The size of the results to be returned (for pagination)
 * @param pageNumber - The page number for the results to be returned (for pagination)
 *
 */
export const getUsersByUsername = async (
	username: string,
	pageSize: number,
	pageNumber: number
) => {
	if (!username) {
		return false;
	}

	const usersList = await db
		.select()
		.from(users)
		.where(sql`${users.username} ILIKE ${'%' + username + '%'}`)
		.orderBy(
			sql`CASE
      WHEN ${users.username} ILIKE ${username.toLowerCase()} THEN 1 
      WHEN ${users.username} ILIKE ${`${username.toLowerCase()}%`} THEN 2
      ELSE 3
    END`,
			asc(users.id)
		)
		.limit(pageSize)
		.offset((pageNumber - 1) * pageSize);

	if (usersList.length === 0) return null;

	const totalCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(users)
		.where(sql`${users.username} ILIKE ${'%' + username + '%'}`)
		.then((result) => result[0].count);

	const totalPages = Math.ceil(totalCount / pageSize);

	return {
		exists: true,
		users: usersList,
		pagination: {
			currentPage: pageNumber,
			totalPages: totalPages,
			pageSize: pageSize,
			totalCount: totalCount,
		},
	};
};

export default {
  getUserById,
  getUserProfileSocialStats,
  createFollower,
  deleteFollower,
  isFollowing,
  getUserAvatarCloudFileKey,
  updateUser,
  getUsersByUsername
};
