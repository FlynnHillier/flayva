import { Request, Response, NextFunction } from "express";

// Logs method and URL for incoming requests
const exampleMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[Middleware] ${req.method} ${req.originalUrl}`);
  next();
};

export default exampleMiddleware;
