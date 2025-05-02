import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

const PostRatingSkeleton = ({ className }: { className?: ClassNameValue }) => (
  <Rating
    rating={5}
    interactive={false}
    className={cn(
      "animate-pulse fill-secondary text-primary/80 shrink-0",
      className
    )}
  />
);

export const PostRating = ({
  rating,
  interactive = false,
  onInteract,
  className,
}: {
  rating: number | undefined;
  interactive?: boolean;
  onInteract?: (rating: number) => void;
  className?: ClassNameValue;
}) => {
  if (rating === undefined) return <PostRatingSkeleton />;

  return (
    <Rating
      rating={rating}
      interactive={interactive}
      className={cn("fill-amber-300 stroke-[1.5] stroke-black", className)}
      onInteract={onInteract}
    />
  );
};
