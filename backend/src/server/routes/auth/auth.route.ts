import { Router, Request, Response } from "express";
import google from "@server/routes/auth/google.route";
import { ensureUnauthenticated, ensureAuthenticated } from "@/server/middleware/auth.middleware";

const router: Router = Router();

router.use("/google", ensureUnauthenticated, google);

/**
 * /auth/me
 *
 * Return details of the status of authentication for the client
 */
router.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user,
    });
  } else {
    res.json({
      authenticated: false,
      message: "Not authenticated",
    });
  }
});

/**
 * /auth/logout
 *
 * Log out the user if they are authenticated
 */
router.get("/logout", ensureAuthenticated, (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      // TODO: log error
      res.status(500).send({ message: "Failed to log out" });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        // TODO: log error
        res.status(500).send({ message: "Failed to log out" });
      }

      res.clearCookie("connect.sid");
      res.status(204).send(); // TODO: perhaps redirect to login page or home page
    });
  });
});

export default router;
