import { Router } from "express";
import socialRouter from "@/server/routes/api/social.route";

const router: Router = Router();

router.use("/s", socialRouter);

export default router;
