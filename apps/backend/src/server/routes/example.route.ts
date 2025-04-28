import { Router } from "express";
import * as exampleController from "@controllers/example.controller";
import exampleMiddleware from "@middleware/example.middleware";

const router: Router = Router();

// Apply example middleware to all routes
router.use(exampleMiddleware);

// Define routes for the example resource
router.get("/", exampleController.getExample);
router.post("/", exampleController.createExample);

export default router;
