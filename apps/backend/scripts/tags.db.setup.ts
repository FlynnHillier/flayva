import { db } from "@/db";
import { tags } from "@/db/schema";
import { RECIPE_TAGS } from "../../../packages/constants/src";

/**
 * Insert recipe tags into the database
 */
export async function dbInsertRecipeTags() {
  await db.insert(tags).values(RECIPE_TAGS).onConflictDoNothing();
}
