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
  delete: async (recipeId: string, ratingId: string) => {
    const { data } = await request({
      url: `/api/r/interactions/${recipeId}/ratings/rating/r/${ratingId}`,
      method: "DELETE",
    });

    return data as { deleted: RecipeRating };
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
  deletePersonal: async (recipeId: string) => {
    const { data } = await request({
      url: `/api/r/interactions/${recipeId}/ratings/rating/me`,
      method: "DELETE",
    });

    return data as RecipeRating;
  },
  fetchPersonal: async (recipeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay
    const { data } = await request({
      url: `/api/r/interactions/${recipeId}/ratings/rating/me`,
      method: "GET",
    });

    return data as {
      rating: RecipeRating | null;
    };
  },
} satisfies ApiObject;
