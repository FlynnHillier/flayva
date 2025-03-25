import { Router } from "express";
import recipeControllers from "@/server/controllers/recipe.controllers";

const router: Router = Router();

//TODO: move this route to a more appropriate location

/**
 * search for recipe tags
 */
router.get("/r/tags/q/:search", recipeControllers.searchSimilarValidRecipeTag);

export default router;
