// ## RECIPE DATA ##
export const TAG_CATEGORIES = ["cuisine", "health"] as const;

export const TAG_GROUPS = ["spice"] as const;

export const INGREDIENT_GROUPS = [
  "Herbs and Spices",
  "Vegetables",
  "Fruits",
  "Nuts",
  "Cereals and cereal products",
  "Pulses",
  "Teas",
  "Gourds",
  "Coffee and coffee products",
  "Soy",
  "Cocoa and cocoa products",
  "Beverages",
  "Aquatic foods",
  "Animal foods",
  "Milk and milk products",
  "Eggs",
  "Confectioneries",
  "Baking goods",
  "Snack foods",
  "Baby foods",
  "Fats and oils",
  "Herbs and spices",
] as const;

export const INGREDIENT_SUBGROUPS = [
  "Herbs",
  "Cabbages",
  "Tropical fruits",
  "Onion-family vegetables",
  "Nuts",
  "Spices",
  "Root vegetables",
  "Shoot vegetables",
  "Cereals",
  "Leaf vegetables",
  "Oilseed crops",
  "Peas",
  "Teas",
  "Fruit vegetables",
  "Gourds",
  "Citrus",
  "Coffee",
  "Pomes",
  "Berries",
  "Other fruits",
  "Soy",
  "Tubers",
  "Lentils",
  "Other pulses",
  "Beans",
  "Drupes",
  "Stalk vegetables",
  "Cocoa",
  "Fermented beverages",
  "Other breads",
  "Cereal products",
  "Soy products",
  "Doughs",
  "Distilled beverages",
  "Fortified wines",
  "Alcoholic beverages",
  "Mollusks",
  "Seaweed",
  "Crustaceans",
  "Fishes",
  "Cetaceans",
  "Bovines",
  "Swine",
  "Other seeds",
  "Other vegetables",
  "Poultry",
  "Venison",
  "Equines",
  "Other aquatic foods",
  "Pinnipeds",
  "Lagomorphs",
  "Ovis",
  "Caprae",
  "Mushrooms",
  "Amphibians",
  "Fermented milk products",
  "Unfermented milks",
  "Eggs",
  "Frozen desserts",
  "Other confectioneries",
  "Candies",
  "Seasonings",
  "Desserts",
  "Snack foods",
  "Flat breads",
  "Dressings",
  "Sauces",
  "Other milk products",
  "Substitutes",
  "Sugars",
  "Condiments",
  "Baking goods",
  "Fruit products",
  "Waters",
  "Fish products",
  "Other beverages",
  "Baby foods",
  "Vegetable products",
  "Animal fats",
  "Spreads",
  "Herb and spice mixtures",
  "Cocoa products",
  "Fermented milks",
  "Leavened breads",
  "Roe",
  "Nutritional beverages",
  "Milk desserts",
  "Herbal teas",
  "Coffee products",
  "Wrappers",
  "Vegetable fats",
  "Bread products",
  "Sweet breads",
  "Brassicas",
  "Cereals and cereal products",
  "Cocoa and cocoa products",
  "Coffee and coffee products",
  "Milk and milk products",
  "Fats and oils",
  "Herbs and Spices",
  "Pulses",
  "Beverages",
  "Fruits",
  "Green vegetables",
  "",
  "Bivalvia",
] as const;

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
