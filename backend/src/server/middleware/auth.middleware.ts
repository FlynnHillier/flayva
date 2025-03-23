import { Request, Response, NextFunction } from "express";

export const ensureUnauthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.status(403).send("Forbidden. Already authenticated.");
  } else next();
};

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("Unauthorized. Please login.");
  } else next();
};
