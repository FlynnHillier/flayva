import { ClassNameValue } from "tailwind-merge";
import type { Post } from "@flayva/backend-types";
import Tag from "@/components/tags/Tag";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Tags({
  tags,
  className,
}: {
  tags: Post["recipe"]["tags"] | undefined;
  className?: ClassNameValue;
}) {
  return (
    <section className={cn("flex flex-row gap-1 flex-wrap", className)}>
      {tags === undefined
        ? Array.from({ length: 3 }, (_, i) => (
            <Skeleton className="w-14 h-6 rounded-xl" key={i} />
          ))
        : tags.map((tag) => <Tag tag={tag} />)}
    </section>
  );
}
