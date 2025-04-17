import { useProfile } from "@/contexts/profile.context";
import { useInfiniteScrollProfilePostPreviews } from "@/hooks/post.hooks";
import { uploadThingFileUrlFromKey } from "@/lib/ut";
import { type PostPreview } from "@flayva-monorepo/shared/types";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { FourSquare } from "react-loading-indicators";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PostPreviewElement = ({ preview }: { preview: PostPreview }) => {
  const imagePreviewUrl = preview.images.at(0)?.key;

  return (
    <Link
      to={`/p/${preview.id}`}
      className={cn("rounded-sm overflow-hidden aspect-square w-full border-1 relative flex justify-center items-center")}
    >
      <span className="absolute bottom-2 left-2 text-white text-md font-bold bg-black/50 bg-opacity-50 py-1 px-1.5 z-20 rounded-sm max-w-4/5 truncate">
        {preview.recipe.title}
      </span>
      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 z-10 transition-opacity ease-in-out " />
      {imagePreviewUrl && (
        <img
          src={uploadThingFileUrlFromKey(imagePreviewUrl)}
          className="object-cover shrink-0 min-w-full min-h-full"
        />
      )}
    </Link>
  );
};

export const ProfileContent = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  const { data, fetchNextPage, error, hasNextPage, isFetchingNextPage, isFetching, isFetched } =
    useInfiniteScrollProfilePostPreviews(profile.user.id);

  const previews = useMemo(
    () => (data ? data.pages.flatMap((page) => page.previews) : []),
    [data, data?.pages]
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (error) toast.error(error.message ?? "Something went wrong while attempting to load posts");
  }, [error]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) fetchNextPage();
  }, [inView, hasNextPage, isFetching]);

  return (
    <div className="w-full max-w-7xl p-3 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4  gap-3  place-items-center">
      {previews.map((preview) => (
        <PostPreviewElement key={preview.id} preview={preview} />
      ))}
      {
        // If there are no posts and not fetching, show a message
        previews.length === 0 && !isFetching && !error && (
          <div className="col-span-full text-center text-gray-500">
            No posts available for this profile.
          </div>
        )
      }
      {
        // If fetching, show a loading indicator
        (isFetchingNextPage || !isFetched) && (
          <div className="col-span-full text-center text-gray-500">
            <FourSquare color={"gray"} size={"small"} />
          </div>
        )
      }
      {error && (
        <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-2">
          <span className="text-red-500">Error loading posts</span>
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            Retry
          </Button>
        </div>
      )}

      <div ref={ref} className="w-full h-[1px]" />
    </div>
  );
};
