import { User } from "@flayva-monorepo/shared/types";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const ProfilePicture = ({
  user,
  className,
}: {
  user?: User;
  className?: ClassNameValue;
}) => {
  if (!user) return <Skeleton className={cn("w-20 h-20", className, "rounded-full")} />;

  return (
    <Avatar className={cn("w-20 h-20 border-2", className)}>
      <AvatarImage src={user.profile_picture_url} alt="Profile picture" />
      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
