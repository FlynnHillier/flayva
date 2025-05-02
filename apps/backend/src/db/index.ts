import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import postgres from "postgres";

const client = postgres(
  `postgres://${env.DB_USER}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${
    env.DB_PORT
  }/postgres`
);

/**
 * Database client
 */
export const db = drizzle(client, { schema });
