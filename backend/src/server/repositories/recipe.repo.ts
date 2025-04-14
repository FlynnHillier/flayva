import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT, POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE } from "@/constants/posts.constants";
import { db } from "@/db";
import { recipes, tags, recipe_tags } from "@/db/schema";
import { sql, asc, eq, inArray, or, and } from "drizzle-orm";

/**
 * Get a list of posts based on their title and tags that are similar to the search query. Uses pagination
 * @param recipeTitle - The title of a recipe in a search query
 * @param selectedTags - Object containing selected tags by category
 * @param cursor - The cursor for pagination
 */
export const searchRecipesByTitleAndTags = async (
  recipeTitle: string,
  selectedTags: Record<string, string[]>,
  cursor: number
) => {
  const limit = POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE;
  const offset = cursor * limit;
  
  // Convert the selectedTags object to a flat array of tag names
  const selectedTagNames = Object.values(selectedTags).flat();
  
  // If no tags are selected, just search by title
  if (selectedTagNames.length === 0) {
    return getRecipesByTitle(recipeTitle, cursor);
  }
  
  // Get tag IDs for the selected tag names
  const tagIds = await db
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.name, selectedTagNames));
  
  const tagIdArray = tagIds.map(t => t.id);
  
  // If we have tags but couldn't find any matching IDs, return empty result
  if (selectedTagNames.length > 0 && tagIdArray.length === 0) {
    return {
      previews: [],
      nextCursor: null,
    };
  }
  
  // Query to find recipes that match the title AND have any of the selected tags
  const recipesWithTags = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      created_at: recipes.created_at,
    })
    .from(recipes)
    .leftJoin(recipe_tags, eq(recipes.id, recipe_tags.recipeID))
    .where(
      and(
        // Title condition
        recipeTitle ? sql`${recipes.title} ILIKE ${'%' + recipeTitle + '%'}` : sql`1=1`,
        // Tag condition - recipe has any of the selected tags
        tagIdArray.length > 0 ? inArray(recipe_tags.tagID, tagIdArray) : sql`1=1`
      )
    )
    .orderBy(
      sql`CASE
        WHEN ${recipes.title} ILIKE ${recipeTitle.toLowerCase()} THEN 1 
        WHEN ${recipes.title} ILIKE ${`${recipeTitle.toLowerCase()}%`} THEN 2
        ELSE 3
      END`,
      asc(recipes.id)
    )
    .limit(limit + 1) // Fetch one extra to check if there are more
    .offset(offset)
    .groupBy(recipes.id); // Group by to avoid duplicates due to multiple tag matches
  
  // Check if we have more results
  const hasMore = recipesWithTags.length > limit;
  
  // Remove the extra item before returning to the client
  const recipesList = hasMore 
    ? recipesWithTags.slice(0, limit) 
    : recipesWithTags;
  
  return {
    previews: recipesList,
    nextCursor: hasMore ? cursor + 1 : null,
  };
};

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
  const limit = POST_PREVIEW_INFINITE_SCROLL_BATCH_SIZE;
  const offset = cursor * limit;
  
  // Fetch one more item than needed to check if there are more results
  const recipesListWithExtra = await db
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
    .limit(limit + 1) // Fetch one extra to check if there are more
    .offset(offset);
  
  // Check if we have more results by seeing if we got the extra item
  const hasMore = recipesListWithExtra.length > limit;
  
  // Remove the extra item before returning to the client
  const recipesList = hasMore 
    ? recipesListWithExtra.slice(0, limit) 
    : recipesListWithExtra;
  
  return {
    previews: recipesList,
    nextCursor: hasMore ? cursor + 1 : null,
  };
};


export default {
  querySimilarValidTagOptions,
  searchRecipesByTitle: getRecipesByTitle,
  searchRecipesByTitleAndTags
};
