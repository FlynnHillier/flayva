import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";
import { useMemo } from "react";
import { ClassNameValue } from "tailwind-merge";

function StarRating({ rating, className }: { rating: number; className: ClassNameValue }) {
  const stars = useMemo<{ full: number; half: boolean }>(
    () => ({
      full: Math.floor(rating),
      half: rating - Math.floor(rating) >= 0.5,
    }),
    [rating]
  );

  return (
    <div className={cn("flex items-center text-yellow-500 w-16 h-16", className)}>
      {Array.from({ length: stars.full }).map((_, index) => (
        <Star key={`full-${index}`} />
      ))}
      {stars.half && <StarHalf key="half" />}
    </div>
  );
}

export default function RecipeSidebarHeader({
  profilePic,
  username,
  rating,
}: {
  profilePic: string;
  username: string;
  rating: number;
}) {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center">
        <img className="w-12 h-12 rounded-full object-cover" src={profilePic} alt={username} />
        <div className="ml-4 text-md font-bold">{username}</div>
      </div>
      <div className="text-gray-500">
        <StarRating rating={rating} className="mt-5" />
        <div className="text-sm font-medium relative ml-8">{rating.toFixed(1)}</div>
      </div>
    </div>
  );
}
