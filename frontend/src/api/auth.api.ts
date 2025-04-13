import { request } from "@/lib/network";
import { User } from "@flayva-monorepo/shared/types";

/**
 * Fetches the user's profile information from the server.
 */
export async function getMe() {
  const { data } = await request({ url: "/auth/me", method: "GET" });

  return { authenticated: data.authenticated, user: data.user } as {
    authenticated: boolean;
    user?: User;
  };
}

/**
 * Fetches the user's profile information from the server.
 */
export async function logout() {
  const { data, status } = await request({
    url: "/auth/logout",
    method: "GET",
  });

  return { message: data.message, ok: status >= 200 && status < 300 };
}
