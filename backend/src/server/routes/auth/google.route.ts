import { createClientURL } from "@/lib/utils";
import { Router, Request, Response } from "express";
import passport from "passport";

const router: Router = Router();

/**
 * /auth/google
 *
 * Google OAuth route
 */
router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * /auth/google/callback
 *
 * Google OAuth callback route
 */
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }), //TODO: update to redirect to login page on failure (with error message)
  (req: Request, res: Response) => {
    // Successful authentication
    res.redirect(createClientURL("/")); // Redirect to home page
  }
);

export default router;
