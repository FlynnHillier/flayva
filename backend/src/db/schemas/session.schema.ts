import { pgTable, text, json, timestamp } from "drizzle-orm/pg-core";

export const sessionTable = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { withTimezone: true, mode: "date" }).notNull(),
});
