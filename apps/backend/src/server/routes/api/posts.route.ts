import { Router } from "express";
import { POST as POST_VALIDATION } from "@flayva/validation";
import { validateMultiPartFormData } from "@/server/middleware/validation.middleware";
import { POST_IMAGE_MAX_COUNT } from "../../../../../../packages/constants/src";
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
  validateMultiPartFormData(POST_VALIDATION.createNewPostFormSchema, {
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
router.get("/feed", postControllers.getFeed);

/**
 * Get post previews by owner ID with infinte scrolling
 *
 * @param ownerId - The ID of the owner to get post previews for
 */
router.get(
  "/owner/inf/:ownerId",
  postControllers.infiniteScrollProfilePostPreviews
);

/**
 * Get post previews by title and tags with infinite scrolling
 *
 * @param title - The title to search for
 * @query tags - JSON string of selected tags by category
 */
router.get(
  "/search/preview",
  postControllers.infiniteScrollTagAndSimilarTitlePostPreviews
);

router.get("/getTagList", postControllers.getTagList);

/**
 * Get post previews by user with tags filtering
 *
 * @param ownerId - The ID of the user
 * @query tags - JSON string of selected tags by category
 */
router.use(
  "/interactions",
  ensureAuthenticated,
  createRouter({
    "/like": {
      handlers: {
        POST: [
          validateRequestBody(z.object({ postId: z.string() })),
          postControllers.interactions.like.add,
        ],
        DELETE: [
          validateRequestBody(z.object({ postId: z.string() })),
          postControllers.interactions.like.remove,
        ],
      },
      router: createRouter({
        "/status/:postId": {
          handlers: {
            GET: [postControllers.interactions.like.status],
          },
        },
      }),
    },
  })
);

export default router;
