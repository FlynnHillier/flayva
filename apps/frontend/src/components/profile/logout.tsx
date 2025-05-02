import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth.hooks";
import { toast } from "sonner";

export function LogoutButton() {
  const { isPending, mutate } = useLogout({
    onError: () => toast.error("failed to log out"),
    onSuccess: () => {
      toast.success("Logged out!");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending}>Logout</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(undefined)}
            disabled={isPending}
          >
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
