import { RECIPE } from "@flayva/validation";
import { z } from "zod";

export type RecipeTag = z.infer<typeof RECIPE.tag>;

export type RecipeIngredientEntry = z.infer<typeof RECIPE.ingredient>;

export type RecipeIngredientReference = z.infer<
  typeof RECIPE.ingredientReference
>;

export type RecipeIngredientUnit = RecipeIngredientEntry["unit"];

export type CreateNewRatingFormSchemaType = z.infer<
  typeof RECIPE.createNewRatingFormSchema
>;
