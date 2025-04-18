import { Request, Response } from "express";

// Handles GET request for the example resource
export const getExample = (req: Request, res: Response): void => {
  res.json({ message: "GET example successful" });
};

// Handles POST request, e.g., creating a new example resource
export const createExample = (req: Request, res: Response): void => {
  res.status(201).json({ message: "Example created successfully" });
};
