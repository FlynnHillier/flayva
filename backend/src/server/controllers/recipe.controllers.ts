import recipeServices from "@/server/services/recipe.services";
import { RecipeTag } from "@flayva-monorepo/shared/types";
import { RequestHandler } from "express";

/**
 * Search for tags that are similar to the search term
 */
export const searchSimilarValidRecipeTag: RequestHandler = async (req, res) => {
  const { searchTerm } = req.params;

  if (!searchTerm) {
    res.status(400).send({ message: "search term is required" });
    return;
  }

  const results: RecipeTag[] = await recipeServices.searchSimilarValidRecipeTag(searchTerm);

  res.status(200).send({
    tags: results,
  });
};

export default {
  searchSimilarValidRecipeTag,
};
