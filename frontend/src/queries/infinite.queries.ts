import { api } from "@/api/api";

/**
 *
 * This is a hacky solution, as typescript is not happy,
 * when use query-key-factory when interfacting with infinite queries.
 *
 * This is a workaround to make it work with the current setup.
 */

type QueryObject = {
  [key: string]:
    | QueryObject
    | ((...args: any[]) => {
        queryFn: (...args: any[]) => Promise<any>;
        queryKey: string[];
      });
};

export const infiniteQueries = {
  recipe: {
    ratings: {
      pagination: (recipeId: string) => ({
        queryFn: (cursor: number) =>
          api.recipe.ratings.pagination(recipeId, cursor),
        queryKey: ["recipe", "interactions", "ratings", recipeId],
      }),
    },
  },
  feed: {
    pagination: () => ({
      queryFn: (excludePostIds: string[]) =>
        api.post.fetchPostsFeed(excludePostIds),
      queryKey: ["feed", "pagination"],
    }),
  },
} satisfies QueryObject;
