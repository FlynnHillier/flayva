import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

function useSwipe(api: CarouselApi | null) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isManual, setIsManual] = useState(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoScroll = () => {
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    setIsManual(true);
    manualTimeoutRef.current = setTimeout(() => setIsManual(false), 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    resetAutoScroll();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !api) return;

    const swipeDistance = touchStartX - touchEndX;
    if (swipeDistance > 100) {
      api.scrollNext();
    } else if (swipeDistance < -100) {
      api.scrollPrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd, isManual };
}

export function SlideshowItem({
  Image,
  caption: quote,
  alt,
}: {
  Image: string;
  caption?: string;
  alt: string;
}) {
  return (
    <CarouselItem className="pl-0">
      <div className="relative h-full w-full">
        <img src={Image} alt={alt} className="h-full w-full object-cover" />
        <div className="absolute  left-0 bottom-0 h-[50%] w-full bg-gradient-to-t from-black to-black/0 z-10"></div>
        <h1 className="absolute lg:text-2xl text-xl pr-10 text-white left-10 bottom-20 z-20">
          {quote && quote.length > 0 ? quote : null}
        </h1>
      </div>
    </CarouselItem>
  );
}

export default function Slideshow({
  className,
  items,
  autoScrollInterval = 5000,
  header,
}: {
  items: { Image: string; caption: string; alt: string }[];
  autoScrollInterval?: number | false;
  header?: string;
  className?: ClassNameValue;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const { handleTouchStart, handleTouchMove, handleTouchEnd, isManual } =
    useSwipe(api);

  useEffect(() => {
    if (!api || isManual || autoScrollInterval === false) return;

    const interval = setInterval(() => api.scrollNext(), autoScrollInterval);
    return () => clearInterval(interval);
  }, [api, isManual, autoScrollInterval]);

  return (
    <Carousel
      className={cn("", className)}
      opts={{
        loop: true,
      }}
      setApi={setApi}
    >
      {header && (
        <h1 className="absolute top-10 left-10 z-50 text-5xl text-background font-black font-stretch-ultra-condensed">
          {header}
        </h1>
      )}
      <div className="absolute  left-0 top-0 h-[50%] w-full bg-gradient-to-b from-black/50 to-black/0 z-10"></div>
      <CarouselContent
        className="ml-0 w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item) => (
          <SlideshowItem
            key={item.alt}
            Image={item.Image}
            caption={item.caption}
            alt={item.alt}
          />
        ))}
      </CarouselContent>
    </Carousel>
  );
}
