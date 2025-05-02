import {
  Circle,
  Heart,
  Home,
  LucideProps,
  Plus,
  Search,
  Text,
  LogIn,
} from "lucide-react";
import logo from "@assets/Logo.svg";
import { useMe } from "@/hooks/auth.hooks";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ProfilePicture } from "../profile/profile-common";

const items = [
  {
    text: "Home",
    url: "/feed",
    icon: Home,
  },
  {
    text: "Search",
    url: "/search",
    icon: Search,
  },
  // {
  //   text: "Notifications",
  //   url: "#", //What will this be?
  //   icon: Heart,
  // },
  {
    text: "Create",
    url: "/create",
    icon: Plus,
  },
  // {
  //   text: "More",
  //   url: "#", //What will this be?
  //   icon: Text,
  // },
];

function SidebarItem({
  text,
  url,
  Icon,
}: {
  text: string;
  url: string;
  Icon: React.ElementType<LucideProps>;
}) {
  const location = useLocation();

  const isActive = useMemo(
    () => location.pathname === url,
    [location.pathname, url]
  );

  return (
    <Link
      to={url}
      className="flex items-center hover:scale-105 transition-transform duration-200"
    >
      <span className="flex shrink-0 items-center">
        <Icon
          className={cn("h-7 w-7 stroke-2", {
            "stroke-3": isActive,
          })}
        />
      </span>
      <span
        className={cn("text-3xl pl-5 lg:flex hidden", {
          "font-bold": isActive,
        })}
      >
        {text}
      </span>
    </Link>
  );
}

function SidebarItemFooter() {
  const { data, isPending } = useMe();
  const location = useLocation();

  const url = useMemo(
    () => (data?.user ? `/profile/${data.user.id}` : "/login"),
    [data?.user?.id]
  );

  const isActive = useMemo(
    () => location.pathname === url,
    [location.pathname, url]
  );

  return (
    <Link
      to={url}
      className={cn(
        "flex justify-start items-center hover:scale-105 transition-transform duration-200  gap-2 sm:gap-4 w-full ",
        {
          "pointer-events-none": isPending,
        }
      )}
    >
      <span className="flex shrink-0 items-center">
        {isPending ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : !data?.user ? (
          <LogIn className="h-8 w-8 m-2" />
        ) : data.user.profile_picture_url ? (
          <ProfilePicture user={data.user} className="size-12" />
        ) : (
          <Circle className="h-12 w-12" />
        )}
      </span>
      {isPending && <Skeleton className="h-7 w-48 hidden lg:inline-block" />}
      {!isPending && (
        <span
          className={cn(
            `text-3xl lg:flex hidden text-nowrap w-48 overflow-ellipsis whitespace-nowrap`,
            {
              "font-semibold": isActive,
            }
          )}
        >
          {data?.user ? data.user.username : "login"}
        </span>
      )}
    </Link>
  );
}

const AppSidebar = () => {
  return (
    <div className="border-r-2 border-neutral-500 w-fit box-border h-full lg:px-3 xl:px-6 lg:items-start items-center bg-background flex flex-col justify-between py-8 text-yellow-950 px-4 shrink-0">
      <div className="flex items-center">
        <span className="lg:size-9 xl:size-10 size-8 shrink-0">
          <img src={logo} alt="logo" />
        </span>
        <span className="lg:text-6xl xl:text-7xl font-black font-stretch-ultra-condensed lg:block hidden">
          {"FLAYVA"}
        </span>
      </div>
      <div className="grow flex flex-col justify-center gap-8 my-4">
        {items.map((item) => (
          <SidebarItem
            text={item.text}
            url={item.url}
            Icon={item.icon}
            key={item.url}
          />
        ))}
      </div>
      <SidebarItemFooter />
    </div>
  );
};

export default AppSidebar;
