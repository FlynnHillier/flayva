import recipeRepo from "@/server/repositories/recipe.repo";
import { NestedRepositoryObject } from "@/types/api.types";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { RATINGS_PAGINATION_PAGE_SIZE } from "@/constants/recipe.constants";

/**
 * Search for tags that are similar to the search term
 * @param searchTerm - the search term
 * @returns a list of tags that are similar to the search term
 */
export const searchSimilarValidRecipeTag = async (searchTerm: string) => {
  const results = await recipeRepo.querySimilarValidTagOptions(searchTerm);

  const formattedTags: RecipeTag[] = results.map((tag) => ({
    tagId: tag.id,
    tagName: tag.name,
    category: tag.category,
    group: tag.group,
  }));

  return formattedTags;
};

export const interactions = {
  ratings: {
    /**
     * Fetch statistics for a recipes ratings
     */
    statistics: {
      byRecipeId: async (recipeId: string) =>
        recipeRepo.interactions.ratings.statistics.byRecipeId(recipeId),
    },
    get: {
      /**
       * Single ratings
       */
      single: {
        byRatingId: (ratingId: string) =>
          recipeRepo.interactions.ratings.get.single.byRatingId(ratingId),
      },
      /**
       * Aggregate ratings
       */
      aggreagate: {
        pagination: async (recipeId: string, cursor: number) => {
          const ratings =
            await recipeRepo.interactions.ratings.get.aggregate.byRecipeId(
              recipeId,
              {
                limit: RATINGS_PAGINATION_PAGE_SIZE,
                offset: cursor,
                orderBy: ({ date }, { desc }) => desc(date),
              }
            );

          return {
            ratings,
            nextCursor:
              ratings.length < RATINGS_PAGINATION_PAGE_SIZE
                ? null
                : cursor + RATINGS_PAGINATION_PAGE_SIZE,
          };
        },
      },
    },
    /**
     * Check if a rating exists for a given user on a recipe
     */
    exists: async (recipeId: string, userId: string) => {
      const existing =
        await recipeRepo.interactions.ratings.get.single.byUserIdAndRecipeId(
          recipeId,
          userId
        );

      return {
        exists: !!existing,
        rating: existing,
      };
    },
    /**
     * Add a new rating to a recipe
     */
    add: async (
      recipeId: string,
      userId: string,
      content: { rating: number; review?: string }
    ) =>
      recipeRepo.interactions.ratings.add(recipeId, userId, {
        rating: content.rating,
        review: content.review,
      }),
  },
} satisfies NestedRepositoryObject;

export default {
  interactions,
  searchSimilarValidRecipeTag,
};
