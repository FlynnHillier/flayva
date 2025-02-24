import { 
    SidebarTrigger, 
    SidebarProvider,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

interface HomePageProps {
    children?: React.ReactNode;
}

const HomePage = ({ children }: HomePageProps) => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main>
            <SidebarTrigger />
            {children}
        </main>
    </SidebarProvider>
  );
}

export default HomePage;