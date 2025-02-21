import { Router, Request, Response } from "express";
import exampleRoute from "@server/routes/example.route";

const router: Router = Router();

// A simple route to test the server
router.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

router.use("/example", exampleRoute);

export default router;
