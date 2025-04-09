import recipeRepo from "@/server/repositories/recipe.repo";
import { NestedRepositoryObject } from "@/types/api.types";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { get } from "http";

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
    get: {
      byId: (ratingId: string) =>
        recipeRepo.interactions.ratings.get.byId(ratingId),
    },
    exists: async (recipeId: string, userId: string) => {
      const existing =
        await recipeRepo.interactions.ratings.get.byUserIdAndRecipeId(
          recipeId,
          userId
        );

      return {
        exists: !!existing,
        rating: existing,
      };
    },
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
