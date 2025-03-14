import { Router } from "express";
import { POST } from "@flayva-monorepo/shared/validation";
import { validateRequestBody } from "zod-express-middleware";
const router: Router = Router();

router.post("/create", validateRequestBody(POST.createNewPostSchema), (req, res) => {
  res.send(req.body);
});

export default router;
