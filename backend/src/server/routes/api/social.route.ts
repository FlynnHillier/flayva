import { Router } from "express";
import socialControllers from "@/server/controllers/social.controllers";

const router: Router = Router();

/**
 * Get a user's profile
 */
router.get("/u/:userID", socialControllers.getUserById);

export default router;
