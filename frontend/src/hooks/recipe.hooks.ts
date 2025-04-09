import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createConfigurableMutation } from "./util/configurableMutation";
import { api } from "@/api/api";
import { queries } from "@/queries";
import { setInfiniteQueryData, setQueryData } from "@/lib/query";
import { infiniteQueries } from "@/queries/infinite.queries";

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
    ["recipe", "interactions", "ratings", recipeId],
    {
      onSuccess: (rating) => {
        // Update the recipe ratings statistics in the cache
        setQueryData(
          queries.recipe.recipeRatingsFetchStatistics(rating.recipe_id),
          (old) =>
            old && {
              ...old,
              ratings: {
                ...old.ratings,
                count: old.ratings.count + 1,
                average:
                  (old.ratings.count * old.ratings.average + rating.rating) /
                  (old.ratings.count + 1),
                distribution: {
                  ...old.ratings.distribution,
                  [rating.rating]:
                    old.ratings.distribution[
                      rating.rating as keyof typeof old.ratings.distribution
                    ] + 1,
                },
              },
            }
        );

        // Update the recipe ratings pagination in the cache
        setInfiniteQueryData(
          infiniteQueries.recipe.ratings.pagination(rating.recipe_id),
          (old) => ({
            ...old,
            pages: [
              {
                ratings: [rating, ...(old?.pages[0]?.ratings ?? [])],
                nextCursor:
                  old?.pages[0]?.nextCursor === undefined
                    ? 1
                    : old.pages[0].nextCursor === null
                    ? null
                    : old.pages[0].nextCursor + 1,
              },
              ...(old?.pages.slice(1) ?? []),
            ],
          })
        );
      },
    }
  );

export const useFetchRecipeRatingStatistics = (recipeId: string | undefined) =>
  useQuery({
    ...queries.recipe.recipeRatingsFetchStatistics(recipeId ?? ""),
    enabled: !!recipeId,
  });

export const useRecipeRatingsPagination = (recipeId: string) =>
  useInfiniteQuery({
    queryKey: infiniteQueries.recipe.ratings.pagination(recipeId).queryKey,
    queryFn: ({ pageParam }) =>
      infiniteQueries.recipe.ratings.pagination(recipeId).queryFn(pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
