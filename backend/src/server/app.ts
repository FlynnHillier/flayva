import express, { Request, Response, NextFunction, Application } from "express";
import indexRouter from "@server/routes/index.route";
import cors from "cors";
import session from "express-session";
import { env } from "@/env";
import passport from "@auth/passport";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";

const app: Application = express();

// Global middleware for parsing JSON & URL-encoded data
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const pgPool = new pg.Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
});
const pgSessionStore = connectPgSimple(session);

app.use(
  session({
    store: new pgSessionStore({
      pool: pgPool,
      pruneSessionInterval: 60 * 20,
    }),
    secret: env.SESSION_SECRET ?? "defaultSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // TODO: Configure cookie settings better
      httpOnly: true,
      secure: false, //TODO: Set to true in production
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
