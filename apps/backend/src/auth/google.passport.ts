import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { account_connections, users } from "@/db/schemas/auth.schema";
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
        .from(account_connections)
        .where(
          and(
            eq(account_connections.provider, "google"),
            eq(account_connections.providerAccountId, profile.id)
          )
        );

      if (existingAccounts.length > 0) {
        // An account exists; fetch the corresponding user record.
        const account = existingAccounts[0];
        const usersFound = await db.select().from(users).where(eq(users.id, account.userId));

        if (usersFound.length > 0) {
          const foundUser = usersFound[0];

          return done(null, {
            id: foundUser.id,
            username: foundUser.username,
            bio: foundUser.bio,
            profile_picture_url: foundUser.profile_picture_url ?? undefined,
          });
        }
        // If for some reason the user is not found, pass an error.
        // TODO: Add Logging here
        return done(new Error("User not found for the authenticated account"));
      }

      // Account not found; create a new user.
      await db.transaction(async (tx) => {
        const insertedUsers = await tx
          .insert(users)
          .values({
            username: profile.displayName,
            profile_picture_url: profile.photos?.[0].value,
          })
          .returning();

        const newUser = insertedUsers[0];

        await tx.insert(account_connections).values({
          userId: newUser.id,
          provider: "google",
          providerAccountId: profile.id,
          email: profile.emails?.[0].value,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        return done(null, {
          id: newUser.id,
          username: newUser.username,
          bio: newUser.bio,
          profile_picture_url: newUser.profile_picture_url ?? undefined,
        });
      });
    } catch (error) {
      return done(error as Error);
    }
  }
);
