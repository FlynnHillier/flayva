import { cn } from "@/lib/utils";
import { User } from "@flayva-monorepo/shared/types";
import { Link } from "react-router-dom";
import { ProfilePicture } from "../profile/profile-common";
import { Skeleton } from "../ui/skeleton";

export const UserCard = ({ user }: { user: User | undefined }) => {
  return (
    <Link
      className={cn("flex flex-row gap-2 items-center h-14 ", {
        "pointer-events-none": !user,
      })}
      to={user ? `/profile/${user.id}` : "#"}
    >
      {user ? (
        <ProfilePicture user={user} className="size-12" />
      ) : (
        <Skeleton className="size-12 rounded-full" />
      )}
      {user ? (
        <span className="text-xl font-semibold truncate max-w-full w-full">
          {user.username}
        </span>
      ) : (
        <Skeleton className="h-6 w-42" />
      )}
    </Link>
  );
};
