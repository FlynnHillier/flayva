import { Router } from "express";
import socialControllers from "@/server/controllers/social.controllers";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { ensureAuthenticated } from "@/server/middleware/auth.middleware";

const router: Router = Router();

/**
 * Get a user's profile
 */
router.get("/u/:userId", socialControllers.getUserById);

router.get("/profile/preview/:userId", socialControllers.getProfilePreview);

router.post(
  "/follow",
  ensureAuthenticated,
  validateRequestBody(
    z.object({
      targetUserId: z.string(),
    })
  ),
  socialControllers.followUser
);

router.post(
  "/unfollow",
  ensureAuthenticated,
  validateRequestBody(
    z.object({
      targetUserId: z.string(),
    })
  ),
  socialControllers.unfollowUser
);

router.get("/isfollowing/:targetUserId", ensureAuthenticated, socialControllers.getFollowStatus);

export default router;
