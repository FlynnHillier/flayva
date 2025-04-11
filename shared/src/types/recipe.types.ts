import { tag } from "@validation/recipe.validation";
import { z } from "zod";

export type RecipeTag = z.infer<typeof tag>;
