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
export const RECIPE_INSTRUCTION_MIN_STEP_COUNT = 1;
export const RECIPE_INSTRUCTION_MAX_STEP_COUNT = 50;

export const RECIPE_INSTRUCTION_MIN_STEP_LENGTH = 10;
export const RECIPE_INSTRUCTION_MAX_STEP_LENGTH = 500;

// # INGREDIENTS #
export const RECIPE_INGREDIENT_MIN_COUNT = 1;
export const RECIPE_INGREDIENT_MAX_COUNT = 50;

export const RECIPE_INGREDIENT_MIN_ID = 1;
export const RECIPE_INGREDIENT_MAX_ID = 100000; //TODO: change this to the actual number of ingredients

export const RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR_MIN = 2;
export const RECIPE_INGREDIENT_FRACTIONAL_DENOMINATOR_MAX = 8;

// # TAGS #
export const RECIPE_TAG_COUNT_MIN = 1;
export const RECIPE_TAG_COUNT_MAX = 10;

export const RECIPE_TAG_ID_MIN = 1;
export const RECIPE_TAG_ID_MAX = 100000; //TODO: change this to the actual number of tags

// # RATINGS #
export const RECIPE_RATING_ID_LENGTH = 13;

export const RECIPE_RATING_MIN = 1;
export const RECIPE_RATING_MAX = 5;

export const RECIPE_RATING_REVIEW_MIN_LENGTH = 10;
export const RECIPE_RATING_REVIEW_MAX_LENGTH = 500;

// # TITLE #
export const RECIPE_TITLE_LENGTH_MIN = 5;
export const RECIPE_TITLE_LENGTH_MAX = 60;

export const RECIPE_DESCRIPTION_LENGTH_MIN = 10;
export const RECIPE_DESCRIPTION_LENGTH_MAX = 180;

// # META INFO #
export const RECIPE_ID_LENGTH = 7;

export const RECIPE_TAGS = [
  // European Cuisines
  { name: "Italian", category: "Cuisine", emoji: "🇮🇹", id: 1 },
  { name: "French", category: "Cuisine", emoji: "🇫🇷", id: 2 },
  { name: "Spanish", category: "Cuisine", emoji: "🇪🇸", id: 3 },
  { name: "Greek", category: "Cuisine", emoji: "🇬🇷", id: 4 },
  { name: "German", category: "Cuisine", emoji: "🇩🇪", id: 5 },
  { name: "British", category: "Cuisine", emoji: "🇬🇧", id: 6 },
  { name: "Portuguese", category: "Cuisine", emoji: "🇵🇹", id: 7 },
  { name: "Mediterranean", category: "Cuisine", emoji: "🫒", id: 8 },
  { name: "Scandinavian", category: "Cuisine", emoji: "🇸🇪", id: 9 },
  { name: "Eastern European", category: "Cuisine", emoji: "🥟", id: 10 },

  // Asian Cuisines
  { name: "Chinese", category: "Cuisine", emoji: "🇨🇳", id: 11 },
  { name: "Japanese", category: "Cuisine", emoji: "🇯🇵", id: 12 },
  { name: "Thai", category: "Cuisine", emoji: "🇹🇭", id: 13 },
  { name: "Korean", category: "Cuisine", emoji: "🇰🇷", id: 14 },
  { name: "Vietnamese", category: "Cuisine", emoji: "🇻🇳", id: 15 },
  { name: "Indian", category: "Cuisine", emoji: "🇮🇳", id: 16 },
  { name: "Malaysian", category: "Cuisine", emoji: "🇲🇾", id: 17 },
  { name: "Filipino", category: "Cuisine", emoji: "🇵🇭", id: 18 },
  { name: "Indonesian", category: "Cuisine", emoji: "🇮🇩", id: 19 },
  { name: "Singaporean", category: "Cuisine", emoji: "🇸🇬", id: 20 },

  // Americas Cuisines
  { name: "American", category: "Cuisine", emoji: "🇺🇸", id: 21 },
  { name: "Mexican", category: "Cuisine", emoji: "🇲🇽", id: 22 },
  { name: "Brazilian", category: "Cuisine", emoji: "🇧🇷", id: 23 },
  { name: "Peruvian", category: "Cuisine", emoji: "🇵🇪", id: 24 },
  { name: "Argentine", category: "Cuisine", emoji: "🇦🇷", id: 25 },
  { name: "Canadian", category: "Cuisine", emoji: "🇨🇦", id: 26 },
  { name: "Caribbean", category: "Cuisine", emoji: "🌶️", id: 27 },
  { name: "Cuban", category: "Cuisine", emoji: "🇨🇺", id: 28 },
  { name: "Jamaican", category: "Cuisine", emoji: "🇯🇲", id: 29 },
  { name: "Colombian", category: "Cuisine", emoji: "🇨🇴", id: 30 },

  // Middle Eastern & African Cuisines
  { name: "Arabic", category: "Cuisine", emoji: "🧆", id: 31 },
  { name: "Lebanese", category: "Cuisine", emoji: "🇱🇧", id: 32 },
  { name: "Turkish", category: "Cuisine", emoji: "🇹🇷", id: 33 },
  { name: "Moroccan", category: "Cuisine", emoji: "🇲🇦", id: 34 },
  { name: "Ethiopian", category: "Cuisine", emoji: "🇪🇹", id: 35 },
  { name: "Egyptian", category: "Cuisine", emoji: "🇪🇬", id: 36 },
  { name: "Israeli", category: "Cuisine", emoji: "🇮🇱", id: 37 },
  { name: "Nigerian", category: "Cuisine", emoji: "🇳🇬", id: 38 },
  { name: "South African", category: "Cuisine", emoji: "🇿🇦", id: 39 },
  { name: "Tunisian", category: "Cuisine", emoji: "🇹🇳", id: 40 },

  // Spice Level
  { name: "Mild", category: "Spice", emoji: "😌", id: 41 },
  { name: "Medium Spicy", category: "Spice", emoji: "🌶️", id: 42 },
  { name: "Medium", category: "Spice", emoji: "🔥", id: 43 },
  { name: "Hot", category: "Spice", emoji: "🥵", id: 44 },
  { name: "Extra Hot", category: "Spice", emoji: "🧯", id: 45 },
  { name: "No Spice", category: "Spice", emoji: "🧊", id: 46 },
  { name: "Sweet & Spicy", category: "Spice", emoji: "🍯", id: 47 },
  { name: "Tangy", category: "Spice", emoji: "🍋", id: 48 },

  // Food Categories
  { name: "Pizza", category: "Category", emoji: "🍕", id: 49 },
  { name: "Sandwiches", category: "Category", emoji: "🥪", id: 50 },
  { name: "Pasta", category: "Category", emoji: "🍝", id: 51 },
  { name: "Vegetarian", category: "Diet", emoji: "🥗", id: 52 },
  { name: "Vegan", category: "Diet", emoji: "🌱", id: 53 },
  { name: "Halal", category: "Diet", emoji: "☪️", id: 54 },
  { name: "Seafood", category: "Category", emoji: "🐟", id: 55 },
  { name: "Desserts", category: "Category", emoji: "🍰", id: 56 },
  { name: "Breakfast", category: "Category", emoji: "🍳", id: 57 },
  { name: "Street Food", category: "Category", emoji: "🌭", id: 58 },
  { name: "Fast Food", category: "Category", emoji: "🍔", id: 59 },
  { name: "Soups", category: "Category", emoji: "🥣", id: 60 },
  { name: "Salads", category: "Category", emoji: "🥬", id: 61 },
  { name: "Grilled", category: "Category", emoji: "🔥", id: 62 },
  { name: "Baked", category: "Category", emoji: "🍞", id: 63 },
  { name: "Fried", category: "Category", emoji: "🍟", id: 64 },
  { name: "Steamed", category: "Category", emoji: "♨️", id: 65 },
  { name: "BBQ", category: "Category", emoji: "🍖", id: 66 },
  { name: "Slow Cooked", category: "Category", emoji: "⏱️", id: 67 },
  { name: "Fusion", category: "Category", emoji: "🔄", id: 68 },
  { name: "Appetizers", category: "Category", emoji: "🧀", id: 69 },
  { name: "Main Course", category: "Category", emoji: "🍽️", id: 70 },
  { name: "Sides", category: "Category", emoji: "🥄", id: 71 },
  { name: "Beverages", category: "Category", emoji: "🥤", id: 72 },
  { name: "Snacks", category: "Category", emoji: "🍿", id: 73 },
  { name: "Healthy", category: "Category", emoji: "💪", id: 74 },
  { name: "Gluten Free", category: "Category", emoji: "🌾", id: 75 },
  { name: "Organic", category: "Category", emoji: "🌿", id: 76 },
] as const satisfies {
  name: string;
  category: string;
  emoji: string;
  id: number;
}[];
