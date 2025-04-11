import recipeRepo from "@/server/repositories/recipe.repo";
import { RecipeTag } from "@flayva-monorepo/shared/types";

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

export default {
  searchSimilarValidRecipeTag,
};
