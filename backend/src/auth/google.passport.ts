import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { accounts, users } from "@/db/schemas/auth.schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { env } from "@/env";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      // Check for an existing account with provider "google" and matching profile ID.
      const existingAccounts = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.provider, "google"), eq(accounts.providerAccountId, profile.id)));

      if (existingAccounts.length > 0) {
        // An account exists; fetch the corresponding user record.
        const account = existingAccounts[0];
        const usersFound = await db.select().from(users).where(eq(users.id, account.userId));

        if (usersFound.length > 0) {
          const foundUser = usersFound[0];

          return done(null, {
            email: foundUser.email,
            id: foundUser.id,
            username: foundUser.username,
          });
        }
        // If for some reason the user is not found, pass an error.
        // TODO: Add Logging here
        return done(new Error("User not found for the authenticated account"));
      }

      // Account not found – create a new user.
      await db.transaction(async (tx) => {
        const insertedUsers = await tx
          .insert(users)
          .values({
            username: profile.displayName ?? profile.emails?.[0].value ?? "Unnamed",
            email: profile.emails?.[0].value,
          })
          .returning();

        const newUser = insertedUsers[0];

        await tx.insert(accounts).values({
          userId: newUser.id,
          provider: "google",
          providerAccountId: profile.id,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        return done(null, {
          email: newUser.email,
          id: newUser.id,
          username: newUser.username,
        });
      });
    } catch (error) {
      return done(error as Error);
    }
  }
);
