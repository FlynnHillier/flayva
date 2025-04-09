import { ProfilePicture } from "@/components/profile/profile-common";
import { type RecipeRating } from "@flayva-monorepo/shared/types";
import { PostRating } from "./ratings-common";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import moment from "moment";
import { useMemo } from "react";
import { Link } from "react-router-dom";

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

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 max-h-72 h-full w-full border-1 rounded-lg overflow-hidden",
        className
      )}
    >
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
      <div className="h-fit truncate text-base text-wrap">{rating.review}</div>
    </div>
  );
};
