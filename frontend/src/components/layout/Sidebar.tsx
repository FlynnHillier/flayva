import { Circle, Heart, Home, LucideProps, Plus, Search, Text, LogIn } from "lucide-react";
import logo from "@assets/Logo.svg";
import { useMe } from "@/hooks/auth.hooks";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";

const items = [
  {
    text: "Home",
    url: "#",
    icon: Home,
  },
  {
    text: "Search",
    url: "#",
    icon: Search,
  },
  {
    text: "Notifications",
    url: "#",
    icon: Heart,
  },
  {
    text: "Create",
    url: "#",
    icon: Plus,
  },
  {
    text: "More",
    url: "#",
    icon: Text,
  },
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
  return (
    <a href={url} className="flex items-center hover:scale-105 transition-transform duration-200">
      <span className="flex shrink-0 items-center">
        <Icon className="h-7 w-7" />
      </span>
      <span className="text-3xl pl-5 lg:flex hidden">{text}</span>
    </a>
  );
}

function SidebarItemFooter() {
  const { data, isPending } = useMe();

  return (
    <Link
      to={data?.user ? "/profile" : "/login"}
      className="flex items-center hover:scale-105 transition-transform duration-200 flex-row gap-2 "
    >
      <span className="flex shrink-0 items-center">
        {isPending ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : !data?.user ? (
          <LogIn className="h-8 w-8 m-2" />
        ) : data.user.profile_picture_url ? (
          <img
            src={data.user.profile_picture_url}
            alt="profile"
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <Circle className="h-12 w-12" />
        )}
      </span>
      {isPending && <Skeleton className="h-7 w-48 hidden lg:inline-block" />}
      {!isPending && (
        <span className="text-3xl lg:flex hidden text-nowrap w-48 overflow-ellipsis  whitespace-nowrap ">
          {data?.user ? data.user.username : "login"}
        </span>
      )}
    </Link>
  );
}

const AppSidebar = () => {
  return (
    <div className="border-r-2 border-neutral-500 w-fit box-border h-full lg:px-8 lg:items-start items-center bg-background flex flex-col justify-between py-8 text-yellow-950 px-4">
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
          <SidebarItem text={item.text} url={item.url} Icon={item.icon} key={item.url} />
        ))}
      </div>
      <SidebarItemFooter />
    </div>
  );
};

export default AppSidebar;
