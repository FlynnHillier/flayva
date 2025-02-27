// ## RECIPE DATA ##
export const TAG_CATEGORIES = ["cuisine", "health"] as const;

export const TAG_GROUPS = ["spice"] as const;

export const INGREDIENT_GROUPS = ["test"] as const;

export const INGREDIENT_SUBGROUPS = ["test"] as const;

export const INGREDIENT_UNITS = [
  "kg",
  "ml",
  "g",
  "l",
  "tbsp",
  "tsp",
  "cup",
  "pinch",
  "dash",
  "whole",
] as const;

// ## RECIPE CONFIG ##

// # INSTRUCTIONS #
export const MIN_RECIPE_INSTRUCTION_STEP_COUNT = 1;
export const MAX_RECIPE_INSTRUCTION_STEP_COUNT = 50;

export const MIN_RECIPE_INSTRUCTION_STEP_LENGTH = 10;
export const MAX_RECIPE_INSTRUCTION_STEP_LENGTH = 500;

// # INGREDIENTS #
export const MIN_RECIPE_INGREDIENT_COUNT = 1;
export const MAX_RECIPE_INGREDIENT_COUNT = 50;

export const MIN_RECIPE_INGREDIENT_ID = 1;
export const MAX_RECIPE_INGREDIENT_ID = 100000; //TODO: change this to the actual number of ingredients

export const MIN_RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR = 2;
export const MAX_RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR = 8;

// # TAGS #
export const MIN_RECIPE_TAG_COUNT = 0;
export const MAX_RECIPE_TAG_COUNT = 10;

export const MIN_RECIPE_TAG_ID = 1;
export const MAX_RECIPE_TAG_ID = 100000; //TODO: change this to the actual number of tags

// # TITLE #
export const MIN_RECIPE_TITLE_LENGTH = 5;
export const MAX_RECIPE_TITLE_LENGTH = 60;

export const MIN_RECIPE_DESCRIPTION_LENGTH = 180;
export const MAX_RECIPE_DESCRIPTION_LENGTH = 10;
