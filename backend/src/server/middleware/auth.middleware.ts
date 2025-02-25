import { Request, Response, NextFunction } from "express";
import { CtxRequest, Http } from "suvidha";

export const expressEnsureUnauthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.status(403).send("Forbidden. Forbidden. Already authenticated.");
  }

  next();
};

/**
 * Middleware to ensure that the user is authenticated
 */
export const ensureAuthenticated = (req: CtxRequest) => {
  if (req.isAuthenticated()) {
    return { user: req.user };
  }

  throw Http.Unauthorized.body({ message: "Unauthorized. Please log in." });
};

/**
 * Middleware to ensure that the user is not authenticated
 */
export const ensureNotAuthenticated = (req: CtxRequest) => {
  if (!req.isAuthenticated()) {
    return { user: undefined };
  }

  // User is authenticated, send a 403 response or redirect to home
  throw Http.Forbidden.body({ message: "Forbidden. Already authenticated." });
};
