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

// # TITLE #
export const RECIPE_TITLE_LENGTH_MIN = 5;
export const RECIPE_TITLE_LENGTH_MAX = 60;

export const RECIPE_DESCRIPTION_LENGTH_MIN = 10;
export const RECIPE_DESCRIPTION_LENGTH_MAX = 180;

// # META INFO #
export const RECIPE_ID_LENGTH = 7;

export const RECIPE_TAGS = [
	// European Cuisines
	{
		name: 'Italian',
		category: 'Cuisine',
		emoji: '🇮🇹',
	},
	{
		name: 'French',
		category: 'Cuisine',
		emoji: '🇫🇷',
	},
	{
		name: 'Spanish',
		category: 'Cuisine',
		emoji: '🇪🇸',
	},
	{
		name: 'Greek',
		category: 'Cuisine',
		emoji: '🇬🇷',
	},
	{
		name: 'German',
		category: 'Cuisine',
		emoji: '🇩🇪',
	},
	{
		name: 'British',
		category: 'Cuisine',
		emoji: '🇬🇧',
	},
	{
		name: 'Portuguese',
		category: 'Cuisine',
		emoji: '🇵🇹',
	},
	{
		name: 'Mediterranean',
		category: 'Cuisine',
		emoji: '🫒',
	},
	{
		name: 'Scandinavian',
		category: 'Cuisine',
		emoji: '🇸🇪',
	},
	{
		name: 'Eastern European',
		category: 'Cuisine',
		emoji: '🥟',
	},

	// Asian Cuisines
	{
		name: 'Chinese',
		category: 'Cuisine',
		emoji: '🇨🇳',
	},
	{
		name: 'Japanese',
		category: 'Cuisine',
		emoji: '🇯🇵',
	},
	{
		name: 'Thai',
		category: 'Cuisine',
		emoji: '🇹🇭',
	},
	{
		name: 'Korean',
		category: 'Cuisine',
		emoji: '🇰🇷',
	},
	{
		name: 'Vietnamese',
		category: 'Cuisine',
		emoji: '🇻🇳',
	},
	{
		name: 'Indian',
		category: 'Cuisine',
		emoji: '🇮🇳',
	},
	{
		name: 'Malaysian',
		category: 'Cuisine',
		emoji: '🇲🇾',
	},
	{
		name: 'Filipino',
		category: 'Cuisine',
		emoji: '🇵🇭',
	},
	{
		name: 'Indonesian',
		category: 'Cuisine',
		emoji: '🇮🇩',
	},
	{
		name: 'Singaporean',
		category: 'Cuisine',
		emoji: '🇸🇬',
	},

	// Americas Cuisines
	{
		name: 'American',
		category: 'Cuisine',
		emoji: '🇺🇸',
	},
	{
		name: 'Mexican',
		category: 'Cuisine',
		emoji: '🇲🇽',
	},
	{
		name: 'Brazilian',
		category: 'Cuisine',
		emoji: '🇧🇷',
	},
	{
		name: 'Peruvian',
		category: 'Cuisine',
		emoji: '🇵🇪',
	},
	{
		name: 'Argentine',
		category: 'Cuisine',
		emoji: '🇦🇷',
	},
	{
		name: 'Canadian',
		category: 'Cuisine',
		emoji: '🇨🇦',
	},
	{
		name: 'Caribbean',
		category: 'Cuisine',
		emoji: '🌶️',
	},
	{
		name: 'Cuban',
		category: 'Cuisine',
		emoji: '🇨🇺',
	},
	{
		name: 'Jamaican',
		category: 'Cuisine',
		emoji: '🇯🇲',
	},
	{
		name: 'Colombian',
		category: 'Cuisine',
		emoji: '🇨🇴',
	},

	// Middle Eastern & African Cuisines
	{
		name: 'Arabic',
		category: 'Cuisine',
		emoji: '🧆',
	},
	{
		name: 'Lebanese',
		category: 'Cuisine',
		emoji: '🇱🇧',
	},
	{
		name: 'Turkish',
		category: 'Cuisine',
		emoji: '🇹🇷',
	},
	{
		name: 'Moroccan',
		category: 'Cuisine',
		emoji: '🇲🇦',
	},
	{
		name: 'Ethiopian',
		category: 'Cuisine',
		emoji: '🇪🇹',
	},
	{
		name: 'Egyptian',
		category: 'Cuisine',
		emoji: '🇪🇬',
	},
	{
		name: 'Israeli',
		category: 'Cuisine',
		emoji: '🇮🇱',
	},
	{
		name: 'Nigerian',
		category: 'Cuisine',
		emoji: '🇳🇬',
	},
	{
		name: 'South African',
		category: 'Cuisine',
		emoji: '🇿🇦',
	},
	{
		name: 'Tunisian',
		category: 'Cuisine',
		emoji: '🇹🇳',
	},

	// Spice Level
	{
		name: 'Mild',
		category: 'Spice',
		emoji: '😌',
	},
	{
		name: 'Medium Spicy',
		category: 'Spice',
		emoji: '🌶️',
	},
	{
		name: 'Medium',
		category: 'Spice',
		emoji: '🔥',
	},
	{
		name: 'Hot',
		category: 'Spice',
		emoji: '🥵',
	},
	{
		name: 'Extra Hot',
		category: 'Spice',
		emoji: '🧯',
	},
	{
		name: 'No Spice',
		category: 'Spice',
		emoji: '🧊',
	},
	{
		name: 'Sweet & Spicy',
		category: 'Spice',
		emoji: '🍯',
	},
	{
		name: 'Tangy',
		category: 'Spice',
		emoji: '🍋',
	},

	// Food Categories
	{
		name: 'Pizza',
		category: 'Category',
		emoji: '🍕',
	},
	{
		name: 'Sandwiches',
		category: 'Category',
		emoji: '🥪',
	},
	{
		name: 'Pasta',
		category: 'Category',
		emoji: '🍝',
	},
	{
		name: 'Vegetarian',
		category: 'Diet',
		emoji: '🥗',
	},
	{
		name: 'Vegan',
		category: 'Diet',
		emoji: '🌱',
	},
  {
		name: 'Halal',
		category: 'Diet',
		emoji: '☪️',
	},
	{
		name: 'Seafood',
		category: 'Category',
		emoji: '🐟',
	},
	{
		name: 'Desserts',
		category: 'Category',
		emoji: '🍰',
	},
	{
		name: 'Breakfast',
		category: 'Category',
		emoji: '🍳',
	},
	{
		name: 'Street Food',
		category: 'Category',
		emoji: '🌭',
	},
	{
		name: 'Fast Food',
		category: 'Category',
		emoji: '🍔',
	},
	{
		name: 'Soups',
		category: 'Category',
		emoji: '🥣',
	},
	{
		name: 'Salads',
		category: 'Category',
		emoji: '🥬',
	},
	{
		name: 'Grilled',
		category: 'Category',
		emoji: '🔥',
	},
	{
		name: 'Baked',
		category: 'Category',
		emoji: '🍞',
	},
	{
		name: 'Fried',
		category: 'Category',
		emoji: '🍟',
	},
	{
		name: 'Steamed',
		category: 'Category',
		emoji: '♨️',
	},
	{
		name: 'BBQ',
		category: 'Category',
		emoji: '🍖',
	},
	{
		name: 'Slow Cooked',
		category: 'Category',
		emoji: '⏱️',
	},
	{
		name: 'Fusion',
		category: 'Category',
		emoji: '🔄',
	},
	{
		name: 'Appetizers',
		category: 'Category',
		emoji: '🧀',
	},
	{
		name: 'Main Course',
		category: 'Category',
		emoji: '🍽️',
	},
	{
		name: 'Sides',
		category: 'Category',
		emoji: '🥄',
	},
	{
		name: 'Beverages',
		category: 'Category',
		emoji: '🥤',
	},
	{
		name: 'Snacks',
		category: 'Category',
		emoji: '🍿',
	},
	{
		name: 'Healthy',
		category: 'Category',
		emoji: '💪',
	},
	{
		name: 'Gluten Free',
		category: 'Category',
		emoji: '🌾',
	},
	{
		name: 'Organic',
		category: 'Category',
		emoji: '🌿',
	},
]