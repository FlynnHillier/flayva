import { ensureAuthenticated } from "@/server/middleware/auth.middleware";
import { Router, Request, Response } from "express";
import { createRouter } from "../util/util";
import { validateRequestBody } from "zod-express-middleware";
import { createNewRatingSchema } from "@flayva-monorepo/shared/validation/recipe.validation";
import recipeControllers from "@/server/controllers/recipe.controllers";

const router: Router = Router();

router.use(
  "/interactions",
  ensureAuthenticated,
  createRouter({
    "/:recipeId/rating": {
      handlers: {
        POST: [
          validateRequestBody(createNewRatingSchema),
          recipeControllers.interactions.ratings.add,
        ],
      },
    },
  })
);

export default router;
