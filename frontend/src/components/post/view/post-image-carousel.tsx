import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadThingFileUrlFromKey } from "@/lib/ut";
import { cn } from "@/lib/utils";
import { Post } from "@flayva-monorepo/shared/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ClassNameValue } from "tailwind-merge";

const PostImageCarouselItem = ({
  imageUrl,
  ...props
}: { imageUrl: string } & ComponentProps<"div">) => {
  const { ref: startRef, inView: startInView } = useInView();
  const { ref: endRef, inView: endInView } = useInView();

  return (
    <CarouselItem className="" {...props}>
      <div
        className={cn(
          "max-w-full max-h-full w-full aspect-square  block relative overflow-hidden rounded-lg",
          props.className
        )}
      >
        {/* Hidden elements to decide wether or not to gray self out  */}
        <div
          className="absolute opacity-0 z-10 block w-[1px] h-[full] left-[30%]"
          ref={startRef}
        />
        <div
          className="absolute opacity-0 z-10 block w-[1px] h-[full] right-[30%]"
          ref={endRef}
        />
        <div
          className={cn(
            "absolute w-full h-full block ease-in transition-colors duration-200 bg-primary/20",
            {
              "bg-primary/0": startInView && endInView,
            }
          )}
        />
        <img
          src={imageUrl}
          alt="Post Image"
          draggable={false}
          className="object-cover w-full h-full rounded-lg select-none"
        />
      </div>
    </CarouselItem>
  );
};

function NextButton({
  className,
  direction,
  onClick,
  disabled,
  ...props
}: {
  className?: ClassNameValue;
  direction: "left" | "right";
  onClick?: () => void;
} & ComponentProps<"button">) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10  duration-200 rounded-full p-2 border-2 transition-all w-fit h-fit",
        {
          "left-2": direction === "left",
          "right-2": direction === "right",
        },
        {
          "bg-primary-foreground/80 hover:bg-primary-foreground border-2 border-primary/40 cursor-pointer":
            !disabled,
          "opacity-0 border-primary/0": disabled,
        },
        className
      )}
      {...props}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" />
      ) : (
        <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" />
      )}
    </button>
  );
}

function CarouselDots({}) {
  //TODO: implement dots
}

export function PostImageCarousel({
  className,
  post,
  slideClassName,
}: {
  className?: ClassNameValue;
  slideClassName?: ClassNameValue;
  post: Post | undefined;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateCanSroll = () => {
      setCanScrollNext(api.canScrollNext());
      setCanScrollPrev(api.canScrollPrev());
    };

    const onScroll = () => updateCanSroll();

    const onSlidesChanged = () => updateCanSroll();

    const onResize = () => updateCanSroll();

    api.on("scroll", onScroll);
    api.on("slidesChanged", onSlidesChanged);
    api.on("resize", onResize);

    updateCanSroll();

    return () => {
      api.off("scroll", onScroll);
      api.off("slidesChanged", onSlidesChanged);
      api.off("resize", onResize);
    };
  }, [api, setCanScrollNext, setCanScrollPrev]);

  if (!post) return <Skeleton className="w-full h-96 sm:h-72 xl:h-96" />;

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: false,
        active: true,
        align: "center",
        containScroll: "trimSnaps",
      }}
      className={cn(
        "max-h-fit max-w-full rounded-lg overflow-hidden ",
        className
      )}
    >
      <CarouselContent>
        {post?.images.map(({ key: uploadThingImageKey }, i) => (
          <PostImageCarouselItem
            onClick={() => api?.scrollTo(i, false)}
            key={i}
            imageUrl={uploadThingFileUrlFromKey(uploadThingImageKey)}
            className={cn(slideClassName)}
          />
        ))}
      </CarouselContent>
      <NextButton
        direction="left"
        onClick={() => api?.scrollPrev(false)}
        disabled={!canScrollPrev}
      />
      <NextButton
        direction="right"
        onClick={() => api?.scrollNext(false)}
        disabled={!canScrollNext}
      />
    </Carousel>
  );
}
