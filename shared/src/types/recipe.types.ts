import { RECIPE } from "shared/src/validation";
import { z } from "zod";

export type RecipeTag = z.infer<typeof RECIPE.tag>;
