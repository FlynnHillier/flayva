/**
 * Fetches the user's profile information from the server.
 */
export async function getMe() {
  const res = await fetch("http://localhost:3000/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const obj = await res.json();

  return obj.user ?? null; //TODO: propery type the response of the fetch request
}
