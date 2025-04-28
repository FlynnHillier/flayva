import { ensureAuthenticated } from "@/server/middleware/auth.middleware";
import { Router, Request, Response } from "express";
import { createRouter } from "../util/util";
import { validateRequestBody } from "zod-express-middleware";
import { RECIPE } from "@flayva/validation";
import recipeControllers from "@/server/controllers/recipe.controllers";

const router: Router = Router();

/**
 * INTERACTIONS
 */
router.use(
  "/interactions/:recipeId",
  ensureAuthenticated,
  createRouter({
    /**
     * RATINGS
     */
    "/ratings": {
      handlers: {
        GET: [recipeControllers.interactions.ratings.pagination],
      },
      router: createRouter({
        "/rating": {
          handlers: {
            POST: [
              validateRequestBody(RECIPE.createNewRatingFormSchema),
              recipeControllers.interactions.ratings.add,
            ],
          },
          router: createRouter({
            "/me": {
              handlers: {
                GET: [recipeControllers.interactions.ratings.fetch.me],
                DELETE: [recipeControllers.interactions.ratings.delete.me],
              },
            },
            "/r/:ratingId": {
              handlers: {
                GET: [recipeControllers.interactions.ratings.fetch.byRatingId],
                DELETE: [
                  recipeControllers.interactions.ratings.delete.byRatingId,
                ],
              },
            },
            "/u/:userId": {
              handlers: {
                GET: [
                  recipeControllers.interactions.ratings.fetch
                    .byRecipeIdAndUserId,
                ],
              },
            },
          }),
        },
        "/statistics": {
          handlers: {
            GET: [recipeControllers.interactions.ratings.statistics],
          },
        },
      }),
    },
  })
);

export default router;
