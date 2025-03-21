import RecipeSidebar from "./RecipeSidebar";
import { useMe } from "@/hooks/auth.hooks";
import { MessageCircle, Heart, Send, ArrowDown, ArrowUp } from "lucide-react";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@components/ui/badge"
import { SlideshowItem } from "@components/Slideshow"

interface Recipe {
  title: string;
  photos: string[];
  tags: string[];
}

function RecipeMain({ posts } : {posts : Recipe[]}) {
  const { data } = useMe();
  const { recipeid } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: window.innerHeight, 
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: -window.innerHeight, 
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
  ref={containerRef}
  className="w-full h-screen relative overflow-y-scroll snap-y snap-mandatory scroll-smooth">
  {posts?.map((post, index) => (
    <div 
      key={post.title}
      className="w-full h-screen snap-start relative pt-10"
    >
      <div className="w-full h-[calc(100%-6rem)] flex items-center justify-center">
        <div className="relative w-10/12 aspect-square mx-auto max-w-4xl">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {post.photos.map((photo, index) => (
                  <SlideshowItem 
                    key={index} 
                    Image={photo} 
                    alt={`Food ${index + 1}`} 
                  />
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 left-5 flex space-x-2 bg-black/50 p-2 rounded-lg">
                <Link to="/recipe/123/comments">
                  <MessageCircle className="w-6 h-6 text-white" />
                </Link>
                <Heart className="w-6 h-6 text-white" />
                <Send className="w-6 h-6 text-white" />
              </div>
              
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
          <div className="absolute top-[calc(100%+0.3rem)] left-0 w-full">
            <div className="w-full">
              <span className="font-bold">{data?.user?.username}</span> - {post.title}
              <div className="mt-2 flex space-x-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="custom" 
                    className={`rounded-full ${index === 0 ? 'outline' : ''}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ArrowUp 
        className="absolute top-2 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={handlePrev} 
      />
      <ArrowDown 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={handleNext} 
      />
    </div>
  ))}
</div>  
  
  );
}



export default function Recipe({ posts } : { posts : Recipe[] }) {
  console.log(posts);
  return (
    <>
      <div className="flex flex-row w-full h-screen">
        <RecipeMain posts={posts}/>
        <RecipeSidebar />
      </div>
    </>
  );
}
