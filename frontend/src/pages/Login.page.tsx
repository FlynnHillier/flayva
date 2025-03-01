import { LoginForm } from "@/components/login-form";
import Slideshow from "@/components/Slideshow";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/hooks/auth.hooks";
import { useGlobalErrorToast } from "@/hooks/error.hooks";
import { toast } from "sonner";
import { User } from "@flayva-monorepo/shared/types";

function TestAuthenticated({ user }: { user: User }) {
  const { showErrorToast } = useGlobalErrorToast();
  const { isPending, mutate } = useLogout({
    onError: () => showErrorToast("failed to log out!"),
    onSuccess: () => {
      toast.success("Logged out!");
    },
  });

  return (
    <>
      <p className="text-green-800"> Authenticated! - '{user.username}' </p>
      <Button disabled={isPending} onClick={() => mutate(undefined)}>
        Logout
      </Button>
    </>
  );
}

function TestUnauthenticated() {
  return (
    <>
    <div className="w-screen h-screen flex items-center justify-center">
      <Slideshow className="sm:block hidden w-[50%] h-full"/>
      <LoginForm className="flex sm:w-[50%] w-full h-full items-center justify-center"/>
    </div>
    </>
  );
}

export default function LoginPage() {
  const { data, isLoading, error } = useMe();

  if (isLoading) return "loading...";
  if (error) return `Error: ${error.message}`;
  if (data?.authenticated && data.user)
    return <TestAuthenticated user={data.user} />;

  return <TestUnauthenticated />;
}
