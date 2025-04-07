
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  BookOpen, 
  BookText, 
  Calendar, 
  Clock, 
  LineChart, 
  Quote, 
  Settings, 
  Target
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: BookOpen,
    },
    {
      title: "My Books",
      url: "/books",
      icon: BookText,
    },
    {
      title: "Reading Sessions",
      url: "/sessions",
      icon: Clock,
    },
    {
      title: "Quotes",
      url: "/quotes",
      icon: Quote,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: Target,
    },
    {
      title: "Statistics",
      url: "/statistics",
      icon: LineChart,
    },
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4">
        <BookOpen className="h-6 w-6 text-book-700" />
        <span className="font-semibold text-lg">ReadFlow</span>
        <SidebarTrigger className="ml-auto h-8 w-8" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild active={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
