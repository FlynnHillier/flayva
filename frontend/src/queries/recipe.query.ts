import { createQueryKeys } from "@lukemorales/query-key-factory";
import { api } from "@/api/api";

export const recipe = createQueryKeys("recipe", {
  fetchRecipeById: (id: string) => ({
    queryFn: () => api.recipe.fetchRecipeById(id),
    queryKey: ["recipe", "id", id],
  }),
});
