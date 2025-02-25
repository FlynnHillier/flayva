import { Circle, Heart, Home, Plus, Search, Text } from "lucide-react";
import SidebarItems from "./SidebarItems";
import logo from "../assets/Logo.svg";

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
    }
]

const AppSidebar = () => {
  return (
      <div className=" border-r-2 border-neutral-500 lg:w-auto w-[76px] h-full lg:px-10 lg:items-start items-center bg-background absolute flex flex-col justify-between pb-12 pt-16">
        <div className='flex items-center' id='logo'>
            <span className="lg:w-[46px] lg:h-[46px] w-8 h-8 shrink-0"><img src={logo} alt="logo"/></span>
            <span className="text-7xl font-black font-stretch-extra-condensed text-yellow-950 lg:block hidden">{"FLAYVA"}</span>
        </div>
        <div id='sidebar-items' className="h-[40%] flex flex-col justify-between">
          {items.map((item) => (
            <SidebarItems title={item.title} url={item.url} Icon={item.icon} />
          ))}
        </div>
        <div id="footer" className="flex justify-start">
          <SidebarItems title={"Profile"} url={"#"} Icon={Circle} />
        </div>
      </div>
  )
}

export default AppSidebar