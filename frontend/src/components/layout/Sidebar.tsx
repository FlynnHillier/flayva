import { Circle, Heart, Home, LucideProps, Plus, Search, Text, LogIn } from "lucide-react";
import logo from "@assets/Logo.svg";
import { useMe } from "@/hooks/auth.hooks";
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Heart,
  },
  {
    title: "Create",
    url: "#",
    icon: Plus,
  },
  {
    title: "More",
    url: "#",
    icon: Text,
  },
];

function SidebarItem({
  title,
  url,
  Icon,
}: {
  title: string;
  url: string;
  Icon: React.ElementType<LucideProps>;
}) {
  return (
    <a href={url} className="flex items-center">
      <span className="flex shrink-0 items-center">
        <Icon className="h-7 w-7" />
      </span>
      <span className="text-3xl pl-5 lg:flex hidden">{title}</span>
    </a>
  );
}

function AuthenticationBanner() {
  const { data, isLoading } = useMe();

  const AuthenticationIcon = ({ className }: { className?: ClassNameValue }) => {
    if (isLoading)
      return <Skeleton className={cn("rounded-full w-8 h-8 inline-block", className)} />;
    if (!data?.user?.profile_picture_url) return <LogIn className={cn("h-8 w-8", className)} />;

    return (
      <img
        src={data?.user?.profile_picture_url}
        alt="avatar"
        className={cn("rounded-full w-8 h-8", className)}
      />
    );
  };

  const AuthenticationText = () => {
    if (isLoading) return <Skeleton className="w-40 h-8" />;
    if (data?.user) return data.user.username;
    return "Log in";
  };

  const redirect = useMemo(() => {
    if (isLoading) return false;
    if (data?.user) return "/profile";

    return "/login";
  }, [data, isLoading]);

  return (
    <a
      className="flex flex-row gap-4 justify-start text-3xl items-center flex-nowrap shrink-0"
      href={redirect || undefined}
    >
      <span className="flex shrink-0 items-center">
        <AuthenticationIcon className={"w-12 h-12"} />
      </span>
      <AuthenticationText />
    </a>
  );
}

const AppSidebar = () => {
  return (
    <div className="border-r-2 border-neutral-500 w-fit h-full px-4 lg:px-8 lg:items-start items-center bg-background flex flex-col justify-between py-8 text-yellow-950">
      <div className="flex items-center" id="logo">
        <span className="lg:w-[46px] lg:h-[46px] w-8 h-8 shrink-0">
          <img src={logo} alt="logo" />
        </span>
        <span className="text-5xl font-black font-stretch-extra-condensed lg:block hidden">
          {"FLAYVA"}
        </span>
      </div>
      <div className="h-[40%] flex flex-col justify-between">
        {items.map((item) => (
          <SidebarItem title={item.title} url={item.url} Icon={item.icon} key={item.url} />
        ))}
      </div>
      <div className="flex justify-start">
        <AuthenticationBanner />
      </div>
    </div>
  );
};

export default AppSidebar;
