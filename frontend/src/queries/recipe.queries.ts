import { createQueryKeys } from "@lukemorales/query-key-factory";

import { api } from "@/api/api";

export const recipe = createQueryKeys("recipe", {
  querySuggestedSimilarTags: (tagQuery: string) => ({
    queryFn: () => api.recipe.querySuggestedSimilarTags(tagQuery),
    queryKey: ["recipe", "querySuggestedSimilarTags", tagQuery],
  }),
  querySuggestedIngredients: (ingredientQuery: string) => ({
    queryFn: () => api.recipe.querySuggestedIngredients(ingredientQuery),
    queryKey: ["recipe", "querySuggestedIngredients", ingredientQuery],
  }),
  recipeRatingsFetchStatistics: (recipeId: string) => ({
    queryFn: () => api.recipe.ratings.statistics(recipeId),
    queryKey: ["recipe", "interactions", "ratings", recipeId],
  }),
  recipeRatingsFetchPersonal: (recipeId: string) => ({
    queryFn: () => api.recipe.ratings.fetchPersonal(recipeId),
    queryKey: ["recipe", "interactions", "ratings", recipeId, "me"],
  }),
});
