import { Router, Request, Response } from "express";
import passport from "passport";

const router: Router = Router();

router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }), //TODO: update to redirect to login page on failure (with error message)
  (req: Request, res: Response) => {
    // Successful authentication
    res.redirect("http://localhost:5173");
  }
);

export default router;
