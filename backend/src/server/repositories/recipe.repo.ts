import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { sql } from "drizzle-orm";

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

export default {
  querySimilarValidTagOptions,
};
