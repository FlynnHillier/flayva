import { Router } from "express";
import { POST as POST_VALIDATION } from "@flayva-monorepo/shared/validation";
import { validateMultiPartFormData } from "@/server/middleware/validation.middleware";
import { POST_IMAGE_MAX_COUNT } from "@flayva-monorepo/shared/constants/post.constants";
import { ensureAuthenticated } from "@/server/middleware/auth.middleware";

import postControllers from "@/server/controllers/post.controllers";

const router: Router = Router();

/**
 * Create a new post
 */
router.post(
  "/create",
  ensureAuthenticated,
  validateMultiPartFormData(POST_VALIDATION.createNewPostSchema, {
    files: [{ key: "images", maxCount: POST_IMAGE_MAX_COUNT }],
    json: ["recipe"],
  }),
  postControllers.createPost
);

export default router;
