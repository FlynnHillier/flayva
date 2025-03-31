import { Router } from "express";
import socialControllers from "@/server/controllers/social.controllers";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { ensureAuthenticated } from "@/server/middleware/auth.middleware";
import { updateProfileFormSchema } from "@flayva-monorepo/shared/validation/social.validation";
import { validateMultiPartFormData } from "@/server/middleware/validation.middleware";

const router: Router = Router();

/**
 * Get a user's profile
 */
router.get("/u/:userId", socialControllers.getUserById);

router.get("/profile/preview/:userId", socialControllers.getProfilePreview);

router.post(
  "/profile/update",
  ensureAuthenticated,
  validateMultiPartFormData(updateProfileFormSchema, {
    files: [{ key: "avatar", maxCount: 1, single: true }],
    json: [],
  }),
  socialControllers.updateOwnUserProfile
);

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
