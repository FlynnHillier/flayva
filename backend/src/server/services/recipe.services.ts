import recipeRepo from "@/server/repositories/recipe.repo";
import { RecipeTag } from "@flayva-monorepo/shared/types";

/**
 * Search for tags that are similar to the search term
 * @param searchTerm - the search term
 * @returns a list of tags that are similar to the search term
 */
export const searchSimilarValidRecipeTag = async (searchTerm: string) => {
  const results: RecipeTag[] = await recipeRepo.querySimilarValidTagOptions(
    searchTerm
  );

  return results;
};

export default {
  searchSimilarValidRecipeTag,
};
