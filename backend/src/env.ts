import dotenv from "dotenv";
dotenv.config({ path: "./.env.local", debug: true });
import { z } from "zod";

/**
 * SCHEMA FOR BACKEND ENV VARIABLES
 */
const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
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
