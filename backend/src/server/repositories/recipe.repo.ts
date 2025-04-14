import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { db } from "@/db";
import { recipe_ratings, tags } from "@/db/schema";
import { NestedRepositoryObject } from "@/types/api.types";
import { DbFindManyParams } from "@/types/db.types";
import { and, eq, gt, lte, SQL, sql } from "drizzle-orm";

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
 * DATA REPOSITORY
 * fetch static data from the database
 */
const DATA_BASIS = {
  ingredients: {
    get: (
      opts: Omit<DbFindManyParams<"ingredient_items">, "with" | "columns">
    ) =>
      db.query.ingredient_items.findMany({
        columns: {
          group: true,
          subgroup: true,
          id: true,
          name: true,
        },
        with: {},
      }),
  },
};

export const data = {
  ingredients: {
    get: DATA_BASIS.ingredients.get,
  },
} satisfies NestedRepositoryObject;

/**
 *
 *
 * INTERACTIONS
 *
 *
 *
 */

/**
 * INTERACTION BASIS
 * these are the basic queries that are used to fetch data from the database
 * other queries will use these as a base to build upon
 * this is to avoid code duplication and to make the code more readable
 */
const INTERACTIONS_BASIS = {
  ratings: {
    statistics: async ({ where }: { where?: SQL }) =>
      db
        .select({
          averageRating: sql<number>`avg(${recipe_ratings.rating})`.mapWith(
            Number
          ),
          ratingCount: sql<number>`count(${recipe_ratings.rating})`.mapWith(
            Number
          ),
          distribution: {
            1: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 1)`.mapWith(
              Number
            ),
            2: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 2)`.mapWith(
              Number
            ),
            3: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 3)`.mapWith(
              Number
            ),
            4: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 4)`.mapWith(
              Number
            ),
            5: sql<number>`count(${recipe_ratings.rating}) filter (where ${recipe_ratings.rating} = 5)`.mapWith(
              Number
            ),
          },
        })
        .from(recipe_ratings)
        .where(
          and(
            where,
            gt(recipe_ratings.rating, 0),
            lte(recipe_ratings.rating, 5)
          )
        ),
    get: (opts: Omit<DbFindManyParams<"recipe_ratings">, "with" | "columns">) =>
      db.query.recipe_ratings.findMany({
        with: {
          recipe: {
            columns: {},
            with: {
              post: {
                columns: {
                  id: true,
                },
              },
            },
          },

          user: {
            columns: {
              username: true,
              profile_picture_url: true,
              id: true,
              bio: true,
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
    /**
     * Delete a rating
     */
    delete: {
      /**
       * Delete a rating by recipeId and userId
       */
      byRecipeIdAndUserId: async (recipeId: string, userId: string) => {
        // TODO: this is hacky to maintain the same 'rating' type, we first fetch the rating and then delete it
        // this is to avoid having to change the type of the function

        const [fetchedRating] = await INTERACTIONS_BASIS.ratings.get({
          where: (recipe_ratings, { eq, and }) =>
            and(
              eq(recipe_ratings.recipe_id, recipeId),
              eq(recipe_ratings.user_id, userId)
            ),
        });

        if (!fetchedRating) return undefined;

        const [deletedRating] = await db
          .delete(recipe_ratings)
          .where(eq(recipe_ratings.id, fetchedRating.id))
          .returning();

        if (!deletedRating) return undefined;

        return fetchedRating;
      },
      /**
       * Delete a rating by ratingId
       */
      byRatingId: async (ratingId: string) => {
        // TODO: this is hacky to maintain the same 'rating' type, we first fetch the rating and then delete it
        // this is to avoid having to change the type of the function

        const [fetchedRating] = await INTERACTIONS_BASIS.ratings.get({
          where: (recipe_ratings, { eq }) => eq(recipe_ratings.id, ratingId),
        });

        if (!fetchedRating) return undefined;

        const [deletedRating] = await db
          .delete(recipe_ratings)
          .where(eq(recipe_ratings.id, fetchedRating.id))
          .returning();

        if (!deletedRating) return undefined;

        return fetchedRating;
      },
    },

    statistics: {
      byRecipeId: async (recipeId: string) => {
        const [rating] = await INTERACTIONS_BASIS.ratings.statistics({
          where: eq(recipe_ratings.recipe_id, recipeId),
        });

        return rating as typeof rating | undefined;
      },
    },
    /**
     * Get ratings for a recipe
     */
    get: {
      get: INTERACTIONS_BASIS.ratings.get,
      aggregate: {
        byRecipeId: async (
          recipeId: string,
          opts: Omit<
            Parameters<typeof INTERACTIONS_BASIS.ratings.get>[0],
            "where"
          > = {}
        ) => {
          const ratings = await INTERACTIONS_BASIS.ratings.get({
            where: eq(recipe_ratings.recipe_id, recipeId),
            ...opts,
          });

          return ratings;
        },
      },
      single: {
        /**
         * Fetch a single rating by recipeId and userId
         */
        byRecipeIdAndUserId: async (recipeId: string, userId: string) => {
          const [rating] = await INTERACTIONS_BASIS.ratings.get({
            where: (recipe_ratings, { eq, and }) =>
              and(
                eq(recipe_ratings.recipe_id, recipeId),
                eq(recipe_ratings.user_id, userId)
              ),
          });

          return rating as typeof rating | undefined;
        },
        /**
         * Fetch a single rating by ratingId
         */
        byRatingId: async (ratingId: string) => {
          const [rating] = await INTERACTIONS_BASIS.ratings.get({
            where: (recipe_ratings, { eq }) => eq(recipe_ratings.id, ratingId),
          });

          return rating as typeof rating | undefined;
        },
        byUserIdAndRecipeId: async (recipeId: string, userId: string) => {
          const [rating] = await INTERACTIONS_BASIS.ratings.get({
            where: (recipe_ratings, { eq, and }) =>
              and(
                eq(recipe_ratings.recipe_id, recipeId),
                eq(recipe_ratings.user_id, userId)
              ),
          });

          return rating as typeof rating | undefined;
        },
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
  data,
};
