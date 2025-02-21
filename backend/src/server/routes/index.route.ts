import { Router, Request, Response } from "express";
import exampleRoute from "@server/routes/example.route";
import apiRoute from "@server/routes/api/api.route";

const router: Router = Router();

router.use("/api", apiRoute);

export default router;
