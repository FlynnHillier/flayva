import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

export const provider = pgEnum("provider", ["google"]);

// Users table for storing basic authentication information.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  username: text("username").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// Accounts table for linking OAuth providers (optional for local auth).
export const accounts = pgTable(
  "accounts",
  {
    // Reference the user via their id.
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    provider: provider("provider").notNull(),
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
