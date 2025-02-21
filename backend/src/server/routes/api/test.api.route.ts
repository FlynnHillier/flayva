import { Router, Request, Response } from "express";

const router: Router = Router();

// A simple route to test the server
router.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

router.post("/echo", (req: Request, res: Response) => {
  if (!req.body.message) res.status(400).send("You didn't send a message to echo!");

  res.send(req.body.message);
});

export default router;
