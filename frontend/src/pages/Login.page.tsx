import { useLogout, useMe } from "@/hooks/auth.hooks";
import { useGlobalErrorToast } from "@/hooks/error.hooks";
import { User } from "@flayva-monorepo/shared";
import { toast } from "sonner";
import { LoginForm } from "@/components/login-form";



function Form() {
  return (
    <>
    <div className="w-screen flex-auto justify-center items-center">
      <LoginForm className={"w-1/2 self-center"} />
    </div>
    </>
  );
}

export default function LoginPage() {
  const { data, isLoading, error } = useMe();

  if (isLoading) return "loading...";
  if (error) return `Error: ${error.message}`;

  return <Form />;
}
