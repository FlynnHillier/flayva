import { usePost } from "@/contexts/post.context";
import { PostImageCarousel } from "./post-image-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Post, RecipeTag } from "@flayva-monorepo/shared/types";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";

function Description({ description }: { description: string | undefined }) {
  return (
    <section className="mb-4 mt-2">
      {description ? (
        <p className="text-base">{description}</p>
      ) : (
        <Skeleton className="h-18 w-96" />
      )}
    </section>
  );
}

function Tags({ tagLinks }: { tagLinks: Post["recipe"]["tagLinks"] | undefined }) {
  //TODO: add icons for tags based on the group / category

  return (
    <section className="mb-6 flex flex-row gap-1 flex-wrap">
      {tagLinks === undefined
        ? Array.from({ length: 3 }, (_, i) => <Skeleton className="w-14 h-6 rounded-xl" key={i} />)
        : tagLinks.map(({ tag }) => (
            <Badge className="h-6 rounde-xl" variant={"outline"} key={tag.id}>
              {capitalizeFirstLetter(tag.name)}
            </Badge>
          ))}
    </section>
  );
}

export function PostBody() {
  const { post } = usePost();

  return (
    <>
      <PostImageCarousel />
      <Description description={post?.recipe.description} />
      <Tags tagLinks={post?.recipe.tagLinks} />
    </>
  );
}
