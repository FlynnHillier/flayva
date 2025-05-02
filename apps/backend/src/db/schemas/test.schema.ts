import { varchar } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const tests = pgTable("tests", {
  id: serial(),
  foo: varchar(),
  bar: integer(),
});
