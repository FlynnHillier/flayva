import { users } from "@/db/schema";
import { recipes } from "@/db/schemas/recipes.schema";
import { POST } from "@flayva-monorepo/shared/constants";
import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

// ## TABLES ##

export const posts = pgTable("posts", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(POST.POST_ID_LENGTH)),
  ownerId: varchar("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  recipeId: varchar("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
});

export const post_likes = pgTable(
  "post_likes",
  {
    postID: varchar("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userID: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    liked_at: timestamp("liked_at", { mode: "string" }).defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.postID, table.userID] })]
);

export const post_comments = pgTable("post_comments", {
  id: varchar("id").primaryKey(),
  comment: varchar("comment").notNull(),
  postID: varchar("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userID: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  commented_at: timestamp("commented_at", { mode: "string" }).defaultNow(),
});

export const post_images = pgTable("post_images", {
  id: serial("id").primaryKey(),
  postID: varchar("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  key: varchar("key").notNull(),
});

// ## RELATIONS ##

export const relations_posts = relations(posts, ({ one, many }) => ({
  owner: one(users, { fields: [posts.ownerId], references: [users.id] }),
  recipe: one(recipes, { fields: [posts.recipeId], references: [recipes.id] }),
  likes: many(post_likes),
  comments: many(post_comments),
  images: many(post_images),
}));

// Define relations for the post_likes table.
export const relations_post_likes = relations(post_likes, ({ one }) => ({
  post: one(posts, { fields: [post_likes.postID], references: [posts.id] }),
  user: one(users, { fields: [post_likes.userID], references: [users.id] }),
}));

// Define relations for the post_comments table.
export const relations_post_comments = relations(post_comments, ({ one }) => ({
  post: one(posts, { fields: [post_comments.postID], references: [posts.id] }),
  user: one(users, { fields: [post_comments.userID], references: [users.id] }),
}));

export const relations_post_images = relations(post_images, ({ one }) => ({
  posts: one(posts, { fields: [post_images.postID], references: [posts.id] }),
}));
