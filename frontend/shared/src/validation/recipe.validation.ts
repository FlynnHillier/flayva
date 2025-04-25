import { zfd } from "zod-form-data";
import {
  RECIPE_DESCRIPTION_LENGTH_MAX,
  RECIPE_INSTRUCTION_MAX_STEP_LENGTH,
  RECIPE_INSTRUCTION_MAX_STEP_COUNT,
  RECIPE_TITLE_LENGTH_MAX,
  RECIPE_DESCRIPTION_LENGTH_MIN,
  RECIPE_INSTRUCTION_MIN_STEP_LENGTH,
  RECIPE_INSTRUCTION_MIN_STEP_COUNT,
  RECIPE_TITLE_LENGTH_MIN,
  RECIPE_INGREDIENT_MIN_ID,
  RECIPE_INGREDIENT_MAX_ID,
  RECIPE_INGREDIENT_MIN_COUNT,
  RECIPE_INGREDIENT_MAX_COUNT,
  RECIPE_TAG_ID_MIN,
  RECIPE_TAG_ID_MAX,
  RECIPE_TAG_COUNT_MAX,
  RECIPE_TAG_COUNT_MIN,
  INGREDIENT_UNITS,
  RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR_MIN,
  RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR_MAX,
  RECIPE_RATING_MIN,
  RECIPE_RATING_MAX,
  RECIPE_RATING_REVIEW_MIN_LENGTH,
  RECIPE_RATING_REVIEW_MAX_LENGTH,
} from "../constants/recipes.constants";
import { z } from "zod";

// ## INSTRUCTIONS ##
export const instruction = z.object({
  instruction: z
    .string()
    .min(RECIPE_INSTRUCTION_MIN_STEP_LENGTH)
    .max(RECIPE_INSTRUCTION_MAX_STEP_LENGTH),
});

export const instructions = z
  .array(instruction)
  .min(RECIPE_INSTRUCTION_MIN_STEP_COUNT)
  .max(RECIPE_INSTRUCTION_MAX_STEP_COUNT);

// ## INGREDIENTS ##
const ingredient_fractional_amount = z
  .object({
    numerator: z.number().int().min(1),
    denominator: z
      .number()
      .int()
      .min(RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR_MIN)
      .max(RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR_MAX),
  })
  .refine(
    ({ denominator, numerator }) => numerator < denominator, // Ensure numerator is less than denominator
    {
      message: "numerator must be less than denominator",
      path: ["numerator"],
    }
  );

const ingredient_amount = z.object({
  whole: z.number().int().min(0).default(0),
  fractional: ingredient_fractional_amount.optional(),
});

export const ingredient_unit = z.enum(INGREDIENT_UNITS);

export const ingredient = z.object({
  name: z.string().min(1),
  id: z.number().min(RECIPE_INGREDIENT_MIN_ID).max(RECIPE_INGREDIENT_MAX_ID),
  amount: ingredient_amount,
  unit: ingredient_unit,
});

export const ingredientReference = ingredient.pick({
  id: true,
  amount: true,
  unit: true,
});

export const ingredientReferences = z
  .array(ingredientReference)
  .min(RECIPE_INGREDIENT_MIN_COUNT)
  .max(RECIPE_INGREDIENT_MAX_COUNT);

export const ingredients = z
  .array(ingredient)
  .min(RECIPE_INGREDIENT_MIN_COUNT)
  .max(RECIPE_INGREDIENT_MAX_COUNT);

// ## TAGS ##
export const tag = z.object({
  id: z.number().min(RECIPE_TAG_ID_MIN).max(RECIPE_TAG_ID_MAX),
  name: z.string(),
  category: z.string(),
  emoji: z.string(),
});

export const tagReference = tag.pick({ id: true });

export const tagReferences = z
  .array(tagReference)
  .min(RECIPE_TAG_COUNT_MIN)
  .max(RECIPE_TAG_COUNT_MAX);

export const tags = z
  .array(tag)
  .min(RECIPE_TAG_COUNT_MIN)
  .max(RECIPE_TAG_COUNT_MAX);

// ## META INFO ##
export const metaInfo = z.object({
  prepTime: z.number().nullable(),
  cookTime: z.number().nullable(),
  servings: z.number().nullable(),
});

// ## RECIPE ##

export const title = z
  .string()
  .min(RECIPE_TITLE_LENGTH_MIN)
  .max(RECIPE_TITLE_LENGTH_MAX);
export const description = z
  .string()
  .min(RECIPE_DESCRIPTION_LENGTH_MIN)
  .max(RECIPE_DESCRIPTION_LENGTH_MAX);

export const recipe = z.object({
  title: title,
  description: description,
  instructions: instructions,
  ingredients: ingredients,
  tags: tags,
  metaInfo: metaInfo.optional(),
});

export const createNewRecipeSchema = z.object({
  title: title,
  description: description,
  instructions: instructions,
  tags: tagReferences,
  ingredients: ingredients, //TODO: use //ingredientReferences,
  metaInfo: metaInfo.optional(),
});

// ## FORMS / REQUEST ##
export const createNewRatingSchema = z.object({
  rating: z.number().min(RECIPE_RATING_MIN).max(RECIPE_RATING_MAX),
  review: z
    .string()
    .min(RECIPE_RATING_REVIEW_MIN_LENGTH)
    .max(RECIPE_RATING_REVIEW_MAX_LENGTH)
    .optional(),
});
