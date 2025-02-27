import {
  MAX_RECIPE_DESCRIPTION_LENGTH,
  MAX_RECIPE_INSTRUCTION_STEP_LENGTH,
  MAX_RECIPE_INSTRUCTION_STEP_COUNT,
  MAX_RECIPE_TITLE_LENGTH,
  MIN_RECIPE_DESCRIPTION_LENGTH,
  MIN_RECIPE_INSTRUCTION_STEP_LENGTH,
  MIN_RECIPE_INSTRUCTION_STEP_COUNT,
  MIN_RECIPE_TITLE_LENGTH,
  MIN_RECIPE_INGREDIENT_ID,
  MAX_RECIPE_INGREDIENT_ID,
  MIN_RECIPE_INGREDIENT_COUNT,
  MAX_RECIPE_INGREDIENT_COUNT,
  MIN_RECIPE_TAG_ID,
  MAX_RECIPE_TAG_ID,
  MAX_RECIPE_TAG_COUNT,
  MIN_RECIPE_TAG_COUNT,
  INGREDIENT_UNITS,
  MIN_RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR,
  MAX_RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR,
} from "shared/src/constants/recipes.constants";
import { z } from "zod";

// ## INSTRUCTIONS ##
const instruction = z.object({
  instruction: z
    .string()
    .min(MIN_RECIPE_INSTRUCTION_STEP_LENGTH)
    .max(MAX_RECIPE_INSTRUCTION_STEP_LENGTH),
});

const instructions = z
  .array(instruction)
  .min(MIN_RECIPE_INSTRUCTION_STEP_COUNT)
  .max(MAX_RECIPE_INSTRUCTION_STEP_COUNT);

// ## INGREDIENTS ##
const ingredient_fractional_amount = z
  .object({
    numerator: z.number().int().min(1),
    denominator: z
      .number()
      .int()
      .min(MIN_RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR)
      .max(MAX_RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR),
  })
  .refine(
    ({ denominator, numerator }) => numerator < denominator, // Ensure numerator is less than denominator
    {
      message: "numerator must be less than denominator",
      path: ["numerator"],
    }
  );

const ingredient_amount = z.object({
  whole: z.number().int().min(0),
  fractional: ingredient_fractional_amount,
});

const ingredient_unit = z.enum(INGREDIENT_UNITS);

const ingredient = z.object({
  id: z.number().min(MIN_RECIPE_INGREDIENT_ID).max(MAX_RECIPE_INGREDIENT_ID),
  amount: ingredient_amount,
  unit: ingredient_unit,
});

const ingredients = z
  .array(ingredient)
  .min(MIN_RECIPE_INGREDIENT_COUNT)
  .max(MAX_RECIPE_INGREDIENT_COUNT);

// ## TAGS ##
const tag = z.object({
  tagId: z.number().min(MIN_RECIPE_TAG_ID).max(MAX_RECIPE_TAG_ID),
});

const tags = z.array(tag).min(MIN_RECIPE_TAG_COUNT).max(MAX_RECIPE_TAG_COUNT);

// ## META INFO ##
const metaInfo = z.object({
  prepTime: z.number().nullable(),
  cookTime: z.number().nullable(),
  servings: z.number().nullable(),
});

// ## RECIPE ##

export const createRecipeSchema = z.object({
  title: z.string().min(MIN_RECIPE_TITLE_LENGTH).max(MAX_RECIPE_TITLE_LENGTH),
  description: z.string().min(MIN_RECIPE_DESCRIPTION_LENGTH).max(MAX_RECIPE_DESCRIPTION_LENGTH),
  instructions: instructions,
  ingredients: ingredients,
  tags: tags,
  metaInfo: metaInfo,
});
