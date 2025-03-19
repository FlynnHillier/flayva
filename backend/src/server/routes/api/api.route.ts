import { Router } from "express";
import socialRouter from "@/server/routes/api/social.route";
//import postRouter from "@server/routes/api/posts.route";

const router: Router = Router();

router.use("/s", socialRouter);
//router.use("/p", postRouter);

export default router;
