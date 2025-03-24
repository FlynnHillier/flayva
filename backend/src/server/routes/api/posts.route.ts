import { Router } from "express";
import { POST as POST_VALIDATION } from "@flayva-monorepo/shared/validation";
import { validateMultiPartFormData } from "@/server/middleware/validation.middleware";
import { POST_IMAGE_MAX_COUNT } from "@flayva-monorepo/shared/constants/post.constants";
import { ensureAuthenticated } from "@/server/middleware/auth.middleware";

import postControllers from "@/server/controllers/post.controllers";
import { validateRequestBody } from "zod-express-middleware";
import { isRequestPostOwner } from "@/server/middleware/post.middleware";
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

/**
 * Delete an existing post
 */
router.delete(
  "/delete",
  ensureAuthenticated,
  validateRequestBody(POST_VALIDATION.deleteExistingPostSchema),
  isRequestPostOwner((req) => req.body.postId),
  postControllers.deletePost
);

/**
 * Get a post by its ID
 */
router.get("/get/id/:id", postControllers.getPostById);

/**
 * Get a feed of posts
 */
router.get("/get/feed", postControllers.getFeed);

export default router;
