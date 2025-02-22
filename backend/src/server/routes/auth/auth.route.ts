import { Router, Request, Response } from "express";
import google from "@server/routes/auth/google.route";

const router: Router = Router();

router.use("/google", google);

export default router;
