import dotenv from "dotenv";
dotenv.config({ path: "./.env.local", debug: true, encoding: "utf8" });
import { z } from "zod";

/**
 * SCHEMA FOR BACKEND ENV VARIABLES
 */
const envSchema = z.object({
  PORT: z.coerce.number().min(1000),

  // DATABASE
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),

  // SERVER
  CLIENT_ORIGIN: z.string().url().optional(),
});

/**
 * type-safe backend env variables
 */
export const env = (() => {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `INVALID ENV: [\n${error.errors.map((e) => `\t'${e.path}' - ${e.message}`).join(",\n")}\n]`
      );
    } else throw error;
  }
})();
