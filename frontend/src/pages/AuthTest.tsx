import { useMe } from "@/hooks/useMe";

export function AuthTest() {
  const { data, isLoading, error } = useMe();

  if (isLoading) return "loading...";
  if (error) return `Error: ${error.message}`;
  if (data) return `Authenticated as ${data.email}`;

  const handleGoogleLogin = () => {
    // Redirect the user to the backend's Google OAuth endpoint
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <>
      <p>"Not authenticated"</p>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </>
  );
}
