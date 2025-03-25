import { Router } from "express";
import google from "@server/routes/auth/google.route";
import { ensureUnauthenticated, ensureAuthenticated } from "@/server/middleware/auth.middleware";
import authControllers from "@/server/controllers/auth.controllers";

const router: Router = Router();

router.use("/google", ensureUnauthenticated, google);

/**
 * /auth/me
 *
 * Return details of the status of authentication for the client
 */
router.get("/me", authControllers.me);

/**
 * /auth/logout
 *
 * Log out the user if they are authenticated
 */
router.get("/logout", ensureAuthenticated, authControllers.logout);

export default router;
