import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/hooks/auth.hooks";
import { User } from "@flayva-monorepo/shared";

function TestAuthenticated({ user }: { user: User }) {
  const { isPending, mutate } = useLogout();

  return (
    <>
      <p className="text-green-800"> Authenticated! - '{user.email}' </p>
      <Button disabled={isPending} onClick={() => mutate()}>
        Logout
      </Button>
    </>
  );
}

function TestUnauthenticated() {
  const handleGoogleLogin = () => {
    // Redirect the user to the backend's Google OAuth endpoint
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <>
      <p className="text-red-700">Not authenticated!</p>
      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </>
  );
}

export function AuthTest() {
  const { data, isLoading, error } = useMe();

  if (isLoading) return "loading...";
  if (error) return `Error: ${error.message}`;
  if (data?.authenticated && data.user) return <TestAuthenticated user={data.user} />;

  return <TestUnauthenticated />;
}
