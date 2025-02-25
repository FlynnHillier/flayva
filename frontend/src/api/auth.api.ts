import { request } from "@/lib/network";
import { User } from "@flayva-monorepo/shared";

/**
 * Fetches the user's profile information from the server.
 */
export async function getMe() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await request({ url: "/auth/me", method: "GET" });

  return { authenticated: res.authenticated, user: res.user } as {
    authenticated: boolean;
    user?: User;
  };
}

/**
 * Fetches the user's profile information from the server.
 */
export async function logout() {
  const res = await request({ url: "/auth/logout", method: "GET" });

  return { message: res.message, ok: res.staus >= 200 && res.status < 300 };
}
