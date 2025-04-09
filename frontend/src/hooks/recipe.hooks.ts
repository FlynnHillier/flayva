import { createConfigurableMutation } from "./util/configurableMutation";
import { api } from "@/api/api";

/**
 *
 *
 * INTERACTIONS
 *
 *
 */

export const useAddRecipeRating = (recipeId: string) =>
  createConfigurableMutation(
    async ({ rating, review }: { rating: number; review?: string }) =>
      await api.recipe.ratings.add(recipeId, rating, review),
    ["recipe", "interactions", "ratings", recipeId]
  );
