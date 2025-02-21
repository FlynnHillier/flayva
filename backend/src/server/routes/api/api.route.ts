import { Router, Request, Response } from "express";
import testRoute from "@server/routes/api/test.api.route";

const router: Router = Router();

// A simple route to test the server
router.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

router.use("/test", testRoute);

export default router;
