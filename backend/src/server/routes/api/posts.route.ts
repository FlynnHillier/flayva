import { Router } from "express";
import * as createRecipeSchema from "@flayva-monorepo/shared/validation";
import { validateRequestBody } from "zod-express-middleware";
const router: Router = Router();

router.post("/create", validateRequestBody(createRecipeSchema), (req, res) => {
  res.send(req.body);
});

export default router;
