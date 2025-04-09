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
      url: `/api/r/interactions/${recipeId}/ratings/rating`,
      method: "POST",
      data: {
        rating,
        review,
      },
    });

    return data as RecipeRating;
  },
  statistics: async (recipeId: string) => {
    const { data } = await request({
      url: `/api/r/interactions/${recipeId}/ratings/statistics`,
      method: "GET",
    });

    return data as {
      recipeId: string;
      ratings: {
        average: number;
        count: number;
        distribution: {
          1: number;
          2: number;
          3: number;
          4: number;
          5: number;
        };
      };
    };
  },
  pagination: async (recipeId: string, cursor: number) => {
    const { data } = await request({
      url: `/api/r/interactions/${recipeId}/ratings`,
      method: "GET",
      params: {
        cursor,
      },
    });

    return data as {
      ratings: RecipeRating[];
      nextCursor: number | null;
    };
  },
} satisfies ApiObject;
