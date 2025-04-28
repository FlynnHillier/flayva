import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/contexts/post.context";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { User } from "@flayva-monorepo/shared/types";
import { ProfilePicture } from "@/components/profile/profile-common";
import { Link } from "react-router-dom";
import { PostRatingSummary } from "./post-interactions";

function UserBanner({ user }: { user: User | undefined }) {
  return (
    <Link
      to={user ? `/profile/${user.id}` : ""}
      className={cn("flex items-center gap-2", {
        "pointer-events-none": !user,
      })}
    >
      <ProfilePicture user={user} className="w-10 h-10" />
      {user?.username ? (
        <span className="font-medium text-primary text-lg">
          {user.username}
        </span>
      ) : (
        <Skeleton className="h-4 w-36" />
      )}
    </Link>
  );
}

function Title({ title }: { title: string | undefined }) {
  return (
    <h1 className="text-4xl xl:text-5xl font-bold truncate pb-1.5 xl:pb-3">
      {title ? capitalizeFirstLetter(title) : <Skeleton className="h-9 w-72" />}
    </h1>
  );
}

function DateStamp({ date }: { date: string | undefined }) {
  return (
    <span className="text-primary text-base font-medium">
      {date ? (
        new Date(date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      ) : (
        <Skeleton className="h-4 w-32" />
      )}
    </span>
  );
}

export function PostHeader() {
  const { post } = usePost();
  return (
    <header className="mb-6 ">
      <div className="flex flex-row justify-between mt-2">
        <UserBanner user={post?.owner} />
        <DateStamp date={post?.created_at ?? undefined} />
      </div>
      <div className="mt-4 flex flex-row flex-wrap items-center gap-x-4 max-w-full border-b-1 h-fit ">
        <Title title={post?.recipe.title} />
        <PostRatingSummary className="my-2" />
      </div>
    </header>
  );
}
