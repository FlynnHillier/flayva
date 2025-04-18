import { Router } from "express";
import recipeControllers from "@/server/controllers/recipe.controllers";
import { ingredient_items } from "@/db/schema";
import { db } from "@/db";
import { sql, asc } from "drizzle-orm";
import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { RecipeIngredientItem, RecipeTag } from "@flayva-monorepo/shared/types";

const router: Router = Router();

//TODO: move this route to a more appropriate location

/**
 * search for recipe tags
 */
router.get(
  "/r/tags/q/:searchTerm",
  recipeControllers.searchSimilarValidRecipeTag
);

//TODO: use controller, repo and service pattern for this route
router.get("/r/ingredients/q/:search", async (req, res) => {
  const searchTerm = req.params.search;

  const results: RecipeIngredientItem[] = await db
    .select()
    .from(ingredient_items)
    .where(
      sql`${ingredient_items.name} ILIKE ${`%${searchTerm.toLowerCase()}%`}`
    )
    .orderBy(
      // 1. search for exact match
      // 2. search for match at the beginning of the string
      // 3. search for match anywhere in the string
      sql`CASE
      WHEN ${ingredient_items.name} ILIKE ${searchTerm.toLowerCase()} THEN 1 
      WHEN ${
        ingredient_items.name
      } ILIKE ${`${searchTerm.toLowerCase()}%`} THEN 2
      ELSE 3
    END`
    )
    .limit(5); //TODO: make this a constant

  // TODO: ensure the returned type satisties the RecipeIngredient type
  res.status(200).json({ ingredients: results });
});

export default router;
