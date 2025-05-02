import { OAUTH_PROVIDERS, USER_ID_LENGTH } from "@/constants/auth.constants";
import { followers } from "@/db/schema";
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
  primaryKey,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const provider = pgEnum("provider", OAUTH_PROVIDERS);

// Users table for storing basic authentication information.
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(USER_ID_LENGTH)),
  username: text("username").notNull(),
  profile_picture_url: text("profile_picture_url"),
  bio: text("bio").notNull().default("Here for the flayva!"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Accounts table for linking OAuth providers (optional for local auth).
export const account_connections = pgTable(
  "account_connections",
  {
    // Reference the user via their id.
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    // The Oauth provider
    provider: provider("provider").notNull(),
    // Email from the oauth provider.
    email: text("email"),
    // The oauth provider's account id.
    providerAccountId: text("provider_account_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  // Using a composite primary key for uniqueness across provider and account id.
  (accounts) => ({
    pk: primaryKey(accounts.provider, accounts.providerAccountId),
    uniqueProviderAccount: uniqueIndex("unique_provider_account").on(
      accounts.provider,
      accounts.providerAccountId
    ),
  })
);

// ## Relationships ##
export const userRelations = relations(users, ({ many }) => ({
  connections: many(account_connections),
  followers: many(followers, { relationName: "follower" }),
  following: many(followers, { relationName: "followed" }),
}));

export const account_connectionRelations = relations(account_connections, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [account_connections.userId] }),
}));
