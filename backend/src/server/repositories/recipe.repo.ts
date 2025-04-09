import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { db } from "@/db";
import { recipe_ratings, tags } from "@/db/schema";
import { NestedRepositoryObject } from "@/types/api.types";
import { DbFindManyParams } from "@/types/db.types";
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

/**
 *
 *
 * INTERACTIONS
 *
 *
 *
 */
const INTERACTIONS_DEFAULTS = {
  ratings: {
    get: (opts: Omit<DbFindManyParams<"recipe_ratings">, "with" | "columns">) =>
      db.query.recipe_ratings.findMany({
        with: {
          user: {
            columns: {
              username: true,
              profile_picture_url: true,
              id: true,
            },
          },
        },
        columns: {
          rating: true,
          review: true,
          date: true,
          id: true,
          recipe_id: true,
        },

        ...opts,
      }),
  },
} satisfies NestedRepositoryObject;

export const interactions = {
  ratings: {
    get: {
      by: INTERACTIONS_DEFAULTS.ratings.get,
      byId: async (ratingId: string) => {
        const [rating] = await INTERACTIONS_DEFAULTS.ratings.get({
          where: (recipe_ratings, { eq }) => eq(recipe_ratings.id, ratingId),
        });

        return rating as typeof rating | undefined;
      },
      byUserIdAndRecipeId: async (recipeId: string, userId: string) => {
        const [rating] = await INTERACTIONS_DEFAULTS.ratings.get({
          where: (recipe_ratings, { eq, and }) =>
            and(
              eq(recipe_ratings.recipe_id, recipeId),
              eq(recipe_ratings.user_id, userId)
            ),
        });

        return rating as typeof rating | undefined;
      },
    },
    add: async (
      recipeId: string,
      userId: string,
      content: { rating: number; review?: string }
    ) => {
      const [rating] = await db
        .insert(recipe_ratings)
        .values({
          recipe_id: recipeId,
          user_id: userId,
          rating: content.rating,
          review: content.review,
        })
        .onConflictDoNothing()
        .returning();

      return rating as typeof rating | undefined;
    },
  },
} satisfies NestedRepositoryObject;

export default {
  querySimilarValidTagOptions,
  interactions,
};
