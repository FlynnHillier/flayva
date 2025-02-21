import express, { Request, Response, NextFunction, Application } from "express";
import indexRouter from "@server/routes/index.route";
import cors from "cors";
import { env } from "@/env";

const app: Application = express();

// Global middleware for parsing JSON & URL-encoded data
app.use(
  cors()
  //{ origin: env.CLIENT_ORIGIN } //TODO: Configure CORS
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Routes
app.use("/", indexRouter);

// Global 404 error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("404 - Not Found");
});

// Global catch-all error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

export default app;
