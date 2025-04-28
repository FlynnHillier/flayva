import { Router } from "express";
import socialRouter from "@/server/routes/api/social.route";
import postRouter from "@server/routes/api/posts.route";
import dataRouter from "@server/routes/api/data.route";
import testRouter from "@server/routes/api/_test.route";
import recipeRouter from "@server/routes/api/recipe.routes";

const router: Router = Router();

router.use("/s", socialRouter);
router.use("/p", postRouter);
router.use("/d", dataRouter);
router.use("/t", testRouter);
router.use("/r", recipeRouter);

export default router;
