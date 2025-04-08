import { Router } from "express";
import { POST as POST_VALIDATION } from "@flayva-monorepo/shared/validation";
import { validateMultiPartFormData } from "@/server/middleware/validation.middleware";
import { POST_IMAGE_MAX_COUNT } from "@flayva-monorepo/shared/constants/post.constants";
import { ensureAuthenticated } from "@/server/middleware/auth.middleware";

import postControllers from "@/server/controllers/post.controllers";
import { validateRequestBody } from "zod-express-middleware";
import { isRequestPostOwner } from "@/server/middleware/post.middleware";
import { createRouter } from "@/server/routes/util/util";
import { z } from "zod";
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

/**
 * Get post previews by owner ID with infinte scrolling
 *
 * @param ownerId - The ID of the owner to get post previews for
 */
router.get(
  "/owner/inf/:ownerId",
  postControllers.infiniteScrollProfilePostPreviews
);

router.use(
  "/interactions",
  ensureAuthenticated,
  createRouter({
    "/like": [
      {
        method: "POST",
        handler: [
          validateRequestBody(z.object({ postId: z.string() })),
          postControllers.interactions.like.add,
        ],
      },
      {
        method: "DELETE",
        handler: [
          validateRequestBody(z.object({ postId: z.string() })),
          postControllers.interactions.like.remove,
        ],
      },
    ],
    "/like/status/:postId": [
      { method: "GET", handler: [postControllers.interactions.like.status] },
    ],
  })
);

export default router;
