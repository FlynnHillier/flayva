import { LoginForm } from "@/components/login-form";
import Slideshow from "@/components/Slideshow";
import { useMe } from "@hooks/auth.hooks";
import { ClassNameValue } from "tailwind-merge";
import { Skeleton } from "@/components/ui/skeleton";

import disp1 from "@assets/disp1.jpg";
import disp2 from "@assets/disp2.jpg";
import disp3 from "@assets/disp3.jpg";
import disp4 from "@assets/disp4.jpg";


//TODO: create a proper set of slideshow items
const SLIDESHOW_ITEMS = [
  {
    Image: disp1,
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp1",
  },
  {
    Image: disp2,
    caption:
      "Loewm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp2",
  },
  {
    Image: disp3,
    caption:
      "Loewm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp3",
  },
  {
    Image: disp4,
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
    alt: "disp4",
  },
];

function LoginImageSlideShow({ className }: { className: ClassNameValue }) {
  return <Slideshow items={SLIDESHOW_ITEMS} header="FLAYVA" className={className} />;
}

export default function LoginPage() {
  const { isLoading, error } = useMe();

  // TODO: improve loading and error states
  if (isLoading) return (
    <div>
      <Skeleton className="h-16 w-16"/>
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
