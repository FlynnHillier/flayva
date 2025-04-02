import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePost } from "@/contexts/post.context";
import { uploadThingFileUrlFromKey } from "@/lib/ut";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

const PostImageCarouselItem = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <CarouselItem>
      <img src={imageUrl} alt="Post Image" className="object-cover w-full h-full rounded-lg" />
    </CarouselItem>
  );
};

export function PostImageCarousel({ className }: { className?: ClassNameValue }) {
  const { post, isLoading } = usePost();

  return (
    <Carousel
      draggable={!!post && !isLoading}
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        loop: false,
      }}
    >
      <CarouselContent className={cn("w-96 h-96", className)}>
        {post?.images.map(({ key: uploadThingImageKey }) => (
          <PostImageCarouselItem
            key={uploadThingImageKey}
            imageUrl={uploadThingFileUrlFromKey(uploadThingImageKey)}
          />
        ))}
      </CarouselContent>
    </Carousel>
  );
}
