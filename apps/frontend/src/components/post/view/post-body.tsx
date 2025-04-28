import { usePost } from "@/contexts/post.context";
import { PostImageCarousel } from "./post-image-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { PostLikeButton } from "./post-interactions";
import Tags from "@/components/tags/Tags";

function Description({
  description,
  className,
}: {
  description: string | undefined;
  className?: ClassNameValue;
}) {
  return (
    <section className={cn("", className)}>
      {description ? (
        <p className="text-base font-normal">{description}</p>
      ) : (
        <Skeleton className="h-18 w-96" />
      )}
    </section>
  );
}

function Interactions({ className }: { className?: ClassNameValue }) {
  const { post } = usePost();
  //TODO: add interactions

  return (
    <section className={cn("flex flex-row gap-4 select-none", className)}>
      <div className="flex flex-row gap-1 items-center">
        <PostLikeButton postId={post?.id} />
        <span className="text-base font-semibold">{post?.likes.count}</span>
      </div>
    </section>
  );
}

export function PostBody() {
  const { post } = usePost();

  return (
    <section className="w-full flex flex-col flex-nowrap space-y-2 ">
      <PostImageCarousel post={post} slideClassName="sm:basis-1/2" />
      <Interactions />
      <Description description={post?.recipe.description} />
      <Tags tags={post?.recipe.tags} />
    </section>
  );
}
