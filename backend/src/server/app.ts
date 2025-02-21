import express, { Request, Response, NextFunction, Application } from "express";
import indexRouter from "@server/routes/index.route";

const app: Application = express();

// Global middleware for parsing JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Routes
app.use("/", indexRouter);

// Global catch-all error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

export default app;
