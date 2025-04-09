import { request } from "@/lib/network";
import { ApiObject } from "@/types/util/api";
import { RecipeRating, RecipeTag } from "@flayva-monorepo/shared/types";

export const querySuggestedSimilarTags = async (tagQuery: string) => {
  const { data } = await request({
    url: `/api/d/r/tags/q/${tagQuery}`,
    method: "GET",
  });

  return data.tags as RecipeTag[];
};

export const ratings = {
  add: async (recipeId: string, rating: number, review?: string) => {
    const { data } = await request({
      url: `/api/r/interactions/${recipeId}/rating`,
      method: "POST",
      data: {
        rating,
        review,
      },
    });

    return data as RecipeRating;
  },
} satisfies ApiObject;
