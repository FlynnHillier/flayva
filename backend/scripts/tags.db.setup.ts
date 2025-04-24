import { db } from "@/db";
import { tags } from "@/db/schema";
import { RECIPE } from "@flayva-monorepo/shared/constants";

/**
 * Insert recipe tags into the database
 */
export async function dbInsertRecipeTags() {
  await db.insert(tags).values(RECIPE.RECIPE_TAGS).onConflictDoNothing();
}
