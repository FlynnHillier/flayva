import { queries } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export const useFetchIngredientsFromSearchQuery = (query: string) => {
  return useQuery({
    ...queries.recipe.querySuggestedIngredients(query),
    enabled: query.length > 0,
  });
};
