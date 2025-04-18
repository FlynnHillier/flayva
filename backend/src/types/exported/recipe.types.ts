import recipeRepo from "@/server/repositories/recipe.repo";

export type RecipeRating = Awaited<
  ReturnType<typeof recipeRepo.interactions.ratings.get.get>
>[number];
