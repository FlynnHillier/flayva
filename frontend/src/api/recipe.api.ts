import { request } from "@/lib/network";
import { RecipeTag } from "@flayva-monorepo/shared/types";

export const querySuggestedSimilarTags = async (tagQuery: string) => {
  const { data } = await request({
    url: `/api/d/r/tags/q/${tagQuery}`,
    method: "GET",
  });

  return data.tags as RecipeTag[];
};

export const querySuggestedIngredients = async (ingredientQuery: string) => {
  if (ingredientQuery.length === 0) return { ingredients: [] };

  const { data } = await request({
    url: `/api/d/r/ingredients/q/${ingredientQuery}`,
    method: "GET",
  });
  return data;
};
