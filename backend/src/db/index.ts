import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import postgres from "postgres";

// Prefer DATABASE_URL from environment for production/deployment flexibility
const client = postgres(
  process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD!)}@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`
);

/**
 * Database client
 */
export const db = drizzle(client, { schema });
