import passport from "passport";
import { googleStrategy } from "@auth/google.passport";
import { db } from "@/db";
import { users } from "@/db/schemas/auth.schema";
import { eq } from "drizzle-orm";
import { UserNotFoundError } from "@/auth/errors";

passport.use(googleStrategy);

// Serialize the user information into the session object
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user information from the session.
passport.deserializeUser(async (id: string, done) => {
  try {
    // Fetch user from your database using their ID
    const foundUsers = await db.select().from(users).where(eq(users.id, id));

    const user = foundUsers[0];

    if (!user) {
      return done(new UserNotFoundError());
    }

    done(null, {
      bio: user.bio ?? undefined,
      profile_picture_url: user.profile_picture_url ?? undefined,
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    done(error);
  }
});

export default passport;
