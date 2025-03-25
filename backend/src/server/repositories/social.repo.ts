import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get a user object from the database by their ID
 * @param userId - the ID of the user
 * @returns the user object or null if the user does not exist
 */
export const getUserById = async (userId: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  return user as typeof user | null;
};

export default {
  getUserById,
};
