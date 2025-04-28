import { defineConfig } from "drizzle-kit";

import { env } from "./src/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    database: "postgres",
    port: env.DB_PORT,
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: false, // Disable SSL for local development
  },
  strict: true,
  verbose: true,
});
