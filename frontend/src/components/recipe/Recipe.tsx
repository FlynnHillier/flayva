import RecipeSidebar from "./RecipeSidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useMe } from "@/hooks/auth.hooks";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Send } from "lucide-react";
import { ArrowBigRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import food1 from "@assets/test/food/food1.jpg";
import food2 from "@assets/test/food/food2.jpeg";
import food3 from "@assets/test/food/food3.jpg";
import food4 from "@assets/test/food/food4.jpeg";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
const photos = [food1, food2, food3, food4];
import { SlideshowItem } from "@components/Slideshow"

function RecipeMain() {
  const { data } = useMe();
  const { recipeid } = useParams();

  return (
<div className="w-full p-4">
  {/* Carousel Container with relative positioning */}
  <div className="relative w-10/12 aspect-square mx-auto">
    {/* Inner rounded container with overflow-hidden */}
    <div className="w-full h-full rounded-xl overflow-hidden">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {photos.map((photo, index) => (
            <SlideshowItem key={index} Image={photo} alt={`Food ${index + 1}`} />
          ))}
        </CarouselContent>
        
        {/* Social Icons */}
        <div className="absolute bottom-4 left-5 flex space-x-2 bg-black/50 p-2 rounded-lg">
              <Link to="/recipe/123/comments">
                <MessageCircle className="w-6 h-6 text-white" />
              </Link>
              <Heart className="w-6 h-6 text-white" />
              <Send className="w-6 h-6 text-white" />
        </div>
        
        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>

    {/* Title & Tags positioned outside overflow container */}
    <div className="absolute -bottom-15 left-0 w-full mt-4">
      <div className="w-full">
        <span className="font-bold">{data?.user?.username}</span> - Post Title
        <div className="mt-2 flex space-x-2">
          <Badge variant={"custom"} className="rounded-full outline">🐔 Chicken</Badge>
          <Badge variant={"custom"} className="rounded-full">🌿 Vegan</Badge>
          <Badge variant={"custom"} className="rounded-full">🍕 Pizza</Badge>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default function Recipe() {
  return (
    <>
      <div className="flex flex-row w-full h-screen">
        <RecipeMain />
        <RecipeSidebar />
      </div>
    </>
  );
}
