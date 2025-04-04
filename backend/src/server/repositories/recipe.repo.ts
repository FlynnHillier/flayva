import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE } from "@/constants/posts.constants";
import { db } from "@/db";
import { recipes, tags } from "@/db/schema";
import { sql, asc } from "drizzle-orm";


/**
 * Query the database for tags that are similar to the search query
 * @param searchQuery - the search query
 * @returns a list of tags that are similar to the search query
 */
export const querySimilarValidTagOptions = async (searchQuery: string) =>
  db
    .select()
    .from(tags)
    .where(sql`${tags.name} ILIKE ${`%${searchQuery.toLowerCase()}%`}`)
    .orderBy(
      // 1. search for exact match
      // 2. search for match at the beginning of the string
      // 3. search for match anywhere in the string
      sql`CASE
    WHEN ${tags.name} ILIKE ${searchQuery.toLowerCase()} THEN 1 
    WHEN ${tags.name} ILIKE ${`${searchQuery.toLowerCase()}%`} THEN 2
    ELSE 3
  END`
    )
    .limit(RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT);

/**
 * Get a list of posts based on their title that are similar to the search query. Uses pagination
 * @param recipeTitle - The title of a recipe in a search query
 * @param pageSize - The size of the results to be returned (for pagination)
 * @param pageNumber - The page number for the results to be returned (for pagination)
 *
 */
export const getRecipesByTitle = async (
	recipeTitle: string,
	cursor: number
) => {
	// TODO: return null instead of false when nothing returned
	// TODO: refeed into getbyid

	const recipesList = await db
		.select()
		.from(recipes)
		.where(sql`${recipes.title} ILIKE ${'%' + recipeTitle + '%'}`)
		.orderBy(
			sql`CASE
      WHEN ${recipes.title} ILIKE ${recipeTitle.toLowerCase()} THEN 1 
      WHEN ${recipes.title} ILIKE ${`${recipeTitle.toLowerCase()}%`} THEN 2
      ELSE 3
    END`,
			asc(recipes.id)
		)
		.limit(POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE)
		.offset((cursor) * POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE);
    
	return {
    previews: recipesList,
    nextCursor:
      recipesList.length < POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE
        ? null
        : cursor + POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE,
  };
};

export default {
  querySimilarValidTagOptions,
  getRecipesByTitle
};
