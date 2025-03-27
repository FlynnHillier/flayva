import { RECIPE } from "@flayva-monorepo/shared/constants";
import { users } from "@/db/schema";
import { posts } from "@/db/schemas/posts.schema";
import { integer, pgEnum, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

// ## ENUMS ##

export const tagCategoryEnum = pgEnum("category", RECIPE.TAG_CATEGORIES);

export const tagGroupEnum = pgEnum("group", RECIPE.TAG_GROUPS);

export const ingredientUnitEnum = pgEnum("unit", RECIPE.INGREDIENT_UNITS);

export const ingredientGroupEnum = pgEnum("ingredient_group", RECIPE.INGREDIENT_GROUPS);

export const ingredientSubgroupEnum = pgEnum("ingredient_subgroup", RECIPE.INGREDIENT_SUBGROUPS);

// ## TABLES ##

export const recipes = pgTable("recipes", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(RECIPE.RECIPE_ID_LENGTH)),
  master_post_id: varchar("master_post_id").references(() => posts.id, { onDelete: "set null" }),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const recipe_meta_infos = pgTable("recipe_meta_infos", {
  estimatedCookTime: varchar("estimated_cook_time"),
  estimatedPrepTime: varchar("estimated_prep_time"),
  servings: integer("servings"),
  recipeId: varchar("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" })
    .primaryKey(),
});

export const recipe_instruction_steps = pgTable(
  "recipe_instruction_steps",
  {
    recipeId: varchar("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    instruction: varchar("instruction").notNull(),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.stepNumber] })]
);

export const recipe_tags = pgTable(
  "recipe_tags",
  {
    recipeID: varchar("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    tagID: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.recipeID, table.tagID] })]
);

export const tags = pgTable("tags", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
  category: tagCategoryEnum("category").notNull(),
  group: tagGroupEnum("group"),
});

export const recipe_ratings = pgTable("recipe_ratings", {
  id: varchar("id").primaryKey(),
  recipe_id: varchar("recipe_id").references(() => recipes.id, { onDelete: "cascade" }),
  user_id: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  review: varchar("review"),
  date: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const recipe_ingredients = pgTable(
  "recipe_ingredients",
  {
    recipe_id: varchar("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    ingredient_id: integer("ingredient_id")
      .notNull()
      .references(() => ingredient_items.id, {
        onDelete: "cascade",
      }),
    amount_whole: integer("amount_whole").notNull(),
    amount_fractional_numerator: integer("amount_fractional_numerator").notNull().default(1),
    amount_fractional_denominator: integer("amount_fractional_denominator").notNull().default(1),
    unit: ingredientUnitEnum("unit").notNull(),
  },
  (table) => [primaryKey({ columns: [table.ingredient_id, table.recipe_id] })]
);

export const ingredient_items = pgTable("ingredients_items", {
  id: integer("id").primaryKey(),
  name: varchar("name").notNull(),
  group: ingredientGroupEnum("group").notNull(),
  subgroup: ingredientSubgroupEnum("subgroup").notNull(),
});

// ## RELATIONS ##

export const relations_recipes = relations(recipes, ({ one, many }) => ({
  masterPost: one(posts, { fields: [recipes.master_post_id], references: [posts.id] }),
  ratings: many(recipe_ratings),
  ingredients: many(recipe_ingredients),
  tagLinks: many(recipe_tags),
  instructions: many(recipe_instruction_steps),
  metaInfo: one(recipe_meta_infos, {
    fields: [recipes.id],
    references: [recipe_meta_infos.recipeId],
  }),
}));

export const relations_recipes_meta_infos = relations(recipe_meta_infos, ({ one }) => ({
  recipe: one(recipes, { fields: [recipe_meta_infos.recipeId], references: [recipes.id] }),
}));

// Define relations for the recipe_ratings table.
export const relations_recipe_ratings = relations(recipe_ratings, ({ one }) => ({
  recipe: one(recipes, { fields: [recipe_ratings.recipe_id], references: [recipes.id] }),
  user: one(users, { fields: [recipe_ratings.user_id], references: [users.id] }),
}));

// Define relations for the recipe_ingredients table.
export const relations_recipe_ingredients = relations(recipe_ingredients, ({ one }) => ({
  recipe: one(recipes, { fields: [recipe_ingredients.recipe_id], references: [recipes.id] }),
  ingredientItem: one(ingredient_items, {
    fields: [recipe_ingredients.ingredient_id],
    references: [ingredient_items.id],
  }),
}));

// Define relations for the recipe_tags table.
export const relations_recipe_tags = relations(recipe_tags, ({ one }) => ({
  tag: one(tags, { fields: [recipe_tags.tagID], references: [tags.id] }),
}));

// Define relations for the tags table.
export const relations_tags = relations(tags, ({ many }) => ({
  recipeTagLinks: many(recipe_tags),
}));

// Define relations for the ingredient_items table.
export const relations_ingredient_items = relations(ingredient_items, ({ one, many }) => ({
  recipeIngredientLinks: many(recipe_ingredients),
}));

// Define relations for the recipe_instruction_steps table.
export const relations_recipe_instruction_steps = relations(
  recipe_instruction_steps,
  ({ one }) => ({
    recipe: one(recipes, { fields: [recipe_instruction_steps.recipeId], references: [recipes.id] }),
  })
);
