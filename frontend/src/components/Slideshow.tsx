import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselApi,
  } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import disp1 from "@assets/disp1.jpg";
import disp2 from "@assets/disp2.jpg";
import disp3 from "@assets/disp3.jpg";
import disp4 from "@assets/disp4.jpg";
import { useSwipe } from "@/hooks/useSwipe";

const items = [
  {
    Image: disp1,
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp1",
  },
  {
    Image: disp2,
    quote: "Loewm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp2",
  },
  {
    Image: disp3,
    quote: "Loewm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp3",
  },
  {
    Image: disp4,
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp4",
  },
];

function SlideshowItem({Image, quote, alt} : {Image: string, quote: string, alt: string}) {
  return (
      <CarouselItem className="pl-0">
        <div className="relative h-full w-full">
          <img src={Image} alt={alt} className="h-full w-full object-cover"/>
          <div className="absolute  left-0 bottom-0 h-[50%] w-full bg-gradient-to-t from-black to-black/0 z-10"></div>
          <h1 className="absolute lg:text-2xl text-xl pr-10 text-white left-10 bottom-20 z-20">&quot;{quote}&quot;</h1>
        </div>
      </CarouselItem>
  )
}

export default function Slideshow({className} : {className: string}) {
  const [api, setApi] = useState<CarouselApi>()
  const { handleTouchStart, handleTouchMove, handleTouchEnd, isManual } = useSwipe(api);

  useEffect(() => {
    if (!api || isManual) return;

    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [api, isManual]);

  return (
    <Carousel className={cn("", className)} 
        opts={{
            loop: true,
        }}
        setApi={setApi}
        >
        <CarouselContent className="ml-0 w-full h-full" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          {items.map((item) => (
             <SlideshowItem key={item.alt} Image={item.Image} quote={item.quote} alt={item.alt}/>
          ))}
        </CarouselContent>
    </Carousel>
  )
}
