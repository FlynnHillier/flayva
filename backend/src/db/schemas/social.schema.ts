import { users } from "@/db/schema";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const followers = pgTable(
  "followers",
  {
    followedId: varchar("followed_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    followerId: varchar("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.followedId, table.followerId] })]
);

// ## Relationships ##
export const followersRelations = relations(followers, ({ one }) => ({
  following: one(users, {
    fields: [followers.followedId],
    references: [users.id],
    relationName: "followed",
  }),
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
    relationName: "follower",
  }),
}));
