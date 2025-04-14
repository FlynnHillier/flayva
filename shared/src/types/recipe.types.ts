import { ingredient, tag } from "@validation/recipe.validation";
import { z } from "zod";

export {
  type RecipeRating,
  type RecipeIngredientItem,
} from "@backendtypes/recipe.types";

export type RecipeTag = z.infer<typeof tag>;

export type RecipeIngredientEntry = z.infer<typeof ingredient>;

export type RecipeIngredientUnit = RecipeIngredientEntry["unit"];
