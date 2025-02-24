import { Router, Request, Response } from "express";
import google from "@server/routes/auth/google.route";
import { ensureAuthenticated, ensureNotAuthenticated } from "@/server/middleware/auth.middleware";
import { createClientURL } from "@/lib/utils";
import { authenticate } from "passport";

const router: Router = Router();

router.use("/google", ensureNotAuthenticated, google);

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

router.get("/logout", ensureAuthenticated, (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      // TODO: log error
      return res.status(500).json({ message: "Failed to log out" });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        // TODO: log error
        return res.status(500).json({ message: "Failed to destroy session" });
      }

      res.clearCookie("connect.sid"); // Clear the session cookie
      res.status(200).send({ message: "successfully logged out" }); // Redirect to login page or home page
    });
  });
});

export default router;
