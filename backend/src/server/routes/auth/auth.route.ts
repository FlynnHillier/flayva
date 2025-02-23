import { Router, Request, Response } from "express";
import google from "@server/routes/auth/google.route";

const router: Router = Router();

router.use("/google", google);

router.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ message: "Not authenticated" });
  }
});

export default router;
