import { db } from "@/db";
import { tags } from "@/db/schema";
import { RECIPE } from "@flayva-monorepo/shared/constants";

/**
 * Insert recipe tags into the database
 */
export async function dbInsertRecipeTags() {
  await db
    .insert(tags)
    .values(
      RECIPE.RECIPE_TAGS.map((tag, i) => ({
        category: tag.category,
        name: tag.name,
        id: i + 1,
        emoji: tag.emoji,
      }))
    )
    .onConflictDoNothing();
}
