import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Circle, Heart, Home, Plus, Search, Text } from "lucide-react";
import SidebarItems from "./SidebarItems";
import logo from "../assets/Logo.svg";
import { useMe } from "@/hooks/auth.hooks";

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
  const { data: user, isLoading, error } = useMe();
  return (
    <Sidebar>
        <SidebarHeader className="pl-[44px] pt-20">
            <div className='flex items-center'>
                <img src={logo} alt="logo" className="w-[46px] h-[46px]"/>
                <span className="text-7xl font-black font-stretch-extra-condensed text-yellow-950">{"FLAYVA"}</span>
            </div>
        </SidebarHeader>
      <SidebarContent className="pl-10">
        <SidebarGroup className="mt-20">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-8">
                  <SidebarMenuButton asChild>
                    <SidebarItems title={item.title} url={item.url} icon={item.icon} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pl-10 mb-10">
        {!isLoading 
        && !error 
        && <SidebarItems title={user?.user?.username === undefined ? "Profile" : user?.user?.username} url={"#"} icon={Circle} />}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar