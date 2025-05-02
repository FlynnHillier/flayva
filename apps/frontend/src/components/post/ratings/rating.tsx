import { ProfilePicture } from "@/components/profile/profile-common";
import type { RecipeRating } from "@flayva/backend-types";
import { PostRating } from "./ratings-common";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import moment from "moment";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useMe } from "@/hooks/auth.hooks";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteRecipeRating } from "@/hooks/recipe.hooks";
import { toast } from "sonner";

const DeleteRecipeRatingButton = ({ rating }: { rating: RecipeRating }) => {
  const { mutate, isPending } = useDeleteRecipeRating(
    rating.recipe_id,
    rating.id
  )({
    onError: (error) => {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
    },
    onSuccess: () => {
      toast.success("Rating deleted");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="self-start hover:cursor-pointer shrink-0"
          disabled={isPending}
        >
          <Trash2
            className={cn("w-5 h-5 hover:text-primary/80", {
              "animate-pulse": isPending,
            })}
          />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your review will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate(undefined)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const RecipeRatingView = ({
  rating,
  className,
}: {
  rating: RecipeRating;
  className: ClassNameValue;
}) => {
  const relativeDate = useMemo(
    () => moment(rating.date).fromNow(),
    [rating.date]
  );

  const { data: me } = useMe();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 max-h-72 h-full w-full border-1 rounded-lg overflow-hidden relative",
        className
      )}
    >
      <div className="flex flex-row flex-nowrap justify-between gap-2 items-center w-full h-fit">
        <Link
          to={`/profile/${rating.user.id}`}
          className="flex flex-row flex-nowrap gap-2 items-center h-fit justify-start w-fit"
        >
          <ProfilePicture user={rating.user} className="w-12 h-12" />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-x-2 items-center shrink-0 w-full text-nowrap">
              <span className="text-sm font-semibold max-w-full truncate ">
                {rating.user.username}
              </span>
              <span className="text-xs text-gray-500 truncate shrink-0 flex-grow-1">
                {relativeDate}
              </span>
            </div>
            <PostRating
              rating={rating.rating}
              interactive={false}
              className="w-5 h-5"
            />
          </div>
        </Link>
        {me?.user?.id === rating.user.id && (
          <DeleteRecipeRatingButton rating={rating} />
        )}
      </div>
      <div className="h-fit truncate text-base text-wrap">{rating.review}</div>
    </div>
  );
};
