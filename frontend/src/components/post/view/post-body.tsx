import { usePost } from "@/contexts/post.context";
import { PostImageCarousel } from "./post-image-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@flayva-monorepo/shared/types";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Heart, MessageSquare } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

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

function Tags({
  tagLinks,
  className,
}: {
  tagLinks: Post["recipe"]["tagLinks"] | undefined;
  className?: ClassNameValue;
}) {
  //TODO: add icons for tags based on the group / category

  return (
    <section className={cn("flex flex-row gap-1 flex-wrap", className)}>
      {tagLinks === undefined
        ? Array.from({ length: 3 }, (_, i) => <Skeleton className="w-14 h-6 rounded-xl" key={i} />)
        : tagLinks.map(({ tag }) => (
            <Badge className="h-6 rounded-xl" variant={"outline"} key={tag.id}>
              {capitalizeFirstLetter(tag.name)}
            </Badge>
          ))}
    </section>
  );
}

function Interactions({ className }: { className?: ClassNameValue }) {
  //TODO: add interactions

  return (
    <section className={cn("flex flex-row gap-4", className)}>
      <button>
        <Heart className="w-6 h-6" />
      </button>
      <button>
        <MessageSquare className="w-6 h-6" />
      </button>
    </section>
  );
}

export function PostBody() {
  const { post } = usePost();

  return (
    <section className="w-full flex flex-col flex-nowrap space-y-2 ">
      <PostImageCarousel />
      <Interactions />
      <Description description={post?.recipe.description} />
      <Tags tagLinks={post?.recipe.tagLinks} />
    </section>
  );
}
