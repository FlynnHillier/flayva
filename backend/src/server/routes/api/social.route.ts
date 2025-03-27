import { Router } from "express";
import socialControllers from "@/server/controllers/social.controllers";

const router: Router = Router();

/**
 * Get a user's profile
 */
router.get("/u/:userId", socialControllers.getUserById);

router.get("/profile/preview/:userId", socialControllers.getProfilePreview);

export default router;
