import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createConfigurableMutation } from "./util/configurableMutation";
import { api } from "@/api/api";
import { queries } from "@/queries";

/**
 *
 *
 * INTERACTIONS
 *
 *
 */

/**
 *
 * RATINGS
 *
 */
export const useAddRecipeRating = (recipeId: string) =>
  createConfigurableMutation(
    async ({ rating, review }: { rating: number; review?: string }) =>
      await api.recipe.ratings.add(recipeId, rating, review),
    ["recipe", "interactions", "ratings", recipeId]
  );

export const useFetchRecipeRatingStatistics = (recipeId: string | undefined) =>
  useQuery({
    ...queries.recipe.recipeRatingsFetchStatistics(recipeId ?? ""),
    enabled: !!recipeId,
  });

export const useRecipeRatingsPagination = (recipeId: string) =>
  useInfiniteQuery({
    queryKey: ["recipe", "interactions", "ratings", "pagination", recipeId],
    queryFn: ({ pageParam }) =>
      api.recipe.ratings.pagination(recipeId, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
