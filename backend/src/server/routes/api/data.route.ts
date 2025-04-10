import { Router } from "express";
import recipeControllers from "@/server/controllers/recipe.controllers";
import { ingredient_items } from "@/db/schema";
import { db } from "@/db";
import { sql, asc } from "drizzle-orm";
import { RECIPE_TAGS_SEARCH_QUERY_RETURN_LIMIT } from "@/constants/posts.constants";
import { RecipeTag } from "@flayva-monorepo/shared/types";

const router: Router = Router();

//TODO: move this route to a more appropriate location

/**
 * search for recipe tags
 */
router.get(
  "/r/tags/q/:searchTerm",
  recipeControllers.searchSimilarValidRecipeTag
);

router.get("/r/ingredients/q/:search", async (req, res) => {
  const searchTerm = req.params.search;

  const results = await db
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
    .limit(5);

  const formattedIngredients = results.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    group: ingredient.group,
    subgroup: ingredient.subgroup,
  }));

  res.status(200).json({ ingredients: formattedIngredients });
});

export default router;
