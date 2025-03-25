import { RequestHandler } from "express";

/**
 * Return details of the status of authentication for the client
 */
export const me: RequestHandler = async (req, res, next) => {
  if (req.isAuthenticated()) res.status(200).send({ authenticated: true, user: req.user });
  else res.status(200).send({ authenticated: false, message: "Not authenticated" });
};

/**
 * Log out the user if they are authenticated
 */
export const logout: RequestHandler = async (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).send({ message: "Failed to log out" });
    } else
      req.session.destroy((sessionErr) => {
        if (sessionErr) res.status(500).send({ message: "Failed to log out" });
        else {
          res.clearCookie("connect.sid");
          res.status(204).send(); // TODO: redirect to login page or home page
        }
      });
  });
};

export default {
  me,
  logout,
};
