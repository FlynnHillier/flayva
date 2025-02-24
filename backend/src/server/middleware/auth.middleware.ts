import { Request, Response, NextFunction } from "express";

/**
 * Middleware to ensure that the user is authenticated
 */
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // User is not authenticated, send a 401 response or redirect to login
  res.status(401).json({ message: "Unauthorized. Please log in." });
};

/**
 * Middleware to ensure that the user is not authenticated
 */
export const ensureNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  // User is authenticated, send a 403 response or redirect to home
  res.status(403).json({ message: "Forbidden. You are already logged in." });
};
