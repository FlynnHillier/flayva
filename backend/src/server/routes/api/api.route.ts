import { Router } from "express";
import socialRouter from "@/server/routes/api/social.route";
import postRouter from "@server/routes/api/posts.route";
import dataRouter from "@server/routes/api/data.route";

const router: Router = Router();

router.use("/s", socialRouter);
router.use("/p", postRouter);
router.use("/d", dataRouter);

export default router;
