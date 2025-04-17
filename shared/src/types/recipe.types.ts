import { tag } from "@validation/recipe.validation";
import { z } from "zod";

export { type RecipeRating } from "@backendtypes/recipe.types";

export type RecipeTag = z.infer<typeof tag>;
