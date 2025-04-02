import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/contexts/post.context";
import { capitalizeFirstLetter } from "@/lib/utils";
import { User } from "@flayva-monorepo/shared/types";
import { ProfilePicture } from "@/components/profile/profile-common";

function UserBanner({ user }: { user: User | undefined }) {
  return (
    <div className="flex items-center mt-2 gap-2">
      <ProfilePicture user={user} className="w-12 h-12" />
      {user?.username ? (
        <span className="font-medium text-primary text-lg">{user.username}</span>
      ) : (
        <Skeleton className="h-4 w-36" />
      )}
    </div>
  );
}

function Title({ title }: { title: string | undefined }) {
  return (
    <h1 className="text-4xl font-bold truncate pb-1.5">
      {title ? capitalizeFirstLetter(title) : <Skeleton className="h-9 w-72" />}
    </h1>
  );
}

export function Rating() {
  // TODO: update this
  return (
    <div className="mt-2 flex items-center text-yellow-500">
      <span className="text-lg">⭐⭐⭐⭐☆</span>
      <span className="ml-2 text-gray-600">(4.5/5)</span>
    </div>
  );
}

export function PostHeader() {
  const { post } = usePost();
  return (
    <header className="mb-6">
      <div className="flex flex-row flex-wrap items-start gap-x-4 max-w-full">
        <Title title={post?.recipe.title} /> <Rating />
      </div>
      <UserBanner user={post?.owner} />
    </header>
  );
}
