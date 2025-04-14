import { db } from '@/db';
import { tags } from '@/db/schema';
import { RECIPE_TAGS } from '@flayva-monorepo/shared/constants/recipes.constants';

const tagsForInsert: Omit<typeof tags.$inferSelect, 'id'>[] = RECIPE_TAGS;


/**
 * Insert recipe tags into the database
 */
export async function dbInsertRecipeTags() {
	await db
		.insert(tags)
		.values(
			tagsForInsert.map((tag, i) => ({
				category: tag.category,
				name: tag.name,
				id: i + 1,
				emoji: tag.emoji
			}))
		)
		.onConflictDoNothing();
}
