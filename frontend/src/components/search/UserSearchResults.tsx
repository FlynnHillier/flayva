import { useEffect } from "react";
import { User } from "@flayva-monorepo/shared/types";
import { useInfiniteUserSearch } from "@/hooks/social.hooks";
import { useDebounce } from "@/hooks/useDebounce.hooks";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useSearchBar } from "./context/searchBar.context";
import { ProfilePicture } from "../profile/profile-common";

const UserSearchResultCardSkeleton = () => (
  <Skeleton className="w-full flex flex-row flex-nowrap items-start gap-3 p-2 rounded-md h-24 border-2 border-secondary ">
    <ProfilePicture user={undefined} className="size-20" />
    <div className="flex flex-col justify-start gap-1 h-full ">
      <Skeleton className="w-36 h-6 rounded-md" />
      <Skeleton className="w-48 h-12 rounded-md" />
    </div>
  </Skeleton>
);

const UserSearchResultCard = ({ user }: { user: User }) => (
  <Link
    to={`/profile/${user.id}`}
    className="w-full flex flex-row flex-nowrap items-start gap-3 p-2 hover:bg-accent rounded-md h-24 border-2  border-secondary"
  >
    <ProfilePicture user={user} className="size-20" />
    <div className="flex flex-col justify-start gap-1 h-full ">
      <span className="text-2xl font-semibold">{user.username}</span>
      <span className="text-muted-foreground text-sm text-wrap max-w-72 truncate">
        {user.bio}
      </span>
    </div>
  </Link>
);

export default function UserSearchResults() {
  const { mode, searchQuery } = useSearchBar();
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
  } = useInfiniteUserSearch(debouncedSearchQuery, { enabled: mode === "user" });

  useEffect(() => {
    if (error)
      toast.error("Something went wrong while attempting to load users");
  }, [error]);

  const users: User[] | undefined = data?.pages.flatMap((page) => page.users);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="h-fit max-h-full overflow-y-auto grid grid-cols-1 gap-3 xl:grid-cols-2 ">
      {/* Each user as a mini component */}
      {users?.map((user: User) => (
        <UserSearchResultCard key={user.id} user={user} />
      ))}

      {/* If loading new data, displays a skeleton of a user */}
      {isLoading &&
        Array.from({ length: 8 }).map((_, index) => (
          <UserSearchResultCardSkeleton key={index} />
        ))}

      {/* If no users are found, show a message */}
      {!isFetching && users?.length === 0 && (
        <span className="text-muted-foreground col-span-full text-center">
          No users found.
        </span>
      )}

      {/* Referene div to track screen scrolling for infinite scrolling */}
      <div ref={ref} style={{ height: "1px" }}></div>
    </div>
  );
}
