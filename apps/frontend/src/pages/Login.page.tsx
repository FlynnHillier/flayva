import { LoginForm } from "@/components/login-form";
import Slideshow from "@/components/Slideshow";
import { useMe } from "@hooks/auth.hooks";
import { ClassNameValue } from "tailwind-merge";
import { Skeleton } from "@/components/ui/skeleton";
import { serverOriginUrl } from "@/lib/network";

const SLIDESHOW_ITEMS = [
  {
    imageUrl: serverOriginUrl("/images/login-slideshow/1.jpg"),
    caption:
      "Satisfy your sweet tooth and get inspired—join Flayva to discover and share stunning desserts like this luscious raspberry layer cake with fellow food lovers!",
    alt: "disp1",
  },
  {
    imageUrl: serverOriginUrl("/images/login-slideshow/2.jpg"),
    caption:
      "Love classic pizza? Join Flayva to explore, share, and connect over delicious creations like this wood-fired Margherita—your next slice of inspiration is waiting!",
    alt: "disp2",
  },
  {
    imageUrl: serverOriginUrl("/images/login-slideshow/3.jpg"),
    caption:
      "Start your day deliciously—join Flayva to share and discover breakfast inspirations like this golden stack of pancakes drizzled with syrup and fresh banana!",
    alt: "disp3",
  },
  {
    imageUrl: serverOriginUrl("/images/login-slideshow/4.jpg"),
    caption:
      "Craving something extraordinary? Join Flayva to discover and share drool-worthy creations like this epic burger—find your next food obsession with our community!",
    alt: "disp4",
  },
] as const satisfies { imageUrl: string; caption: string; alt: string }[];

function LoginImageSlideShow({ className }: { className: ClassNameValue }) {
  return (
    <Slideshow items={SLIDESHOW_ITEMS} header="FLAYVA" className={className} />
  );
}

export default function LoginPage() {
  const { isLoading, error } = useMe();

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-16 w-16" />
      </div>
    );
  if (error) return `Error: ${error.message}`;

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoginImageSlideShow className="lg:block hidden w-[50%] h-full" />
      <div className="grow flex items-center justify-center h-full">
        <LoginForm className="flex xl:w-lg lg:w-96 w-96 sm:w-lg h-full items-center justify-center border-0" />
      </div>
    </div>
  );
}
