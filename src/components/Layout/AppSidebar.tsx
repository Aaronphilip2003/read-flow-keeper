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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  BookText,
  Calendar,
  Clock,
  LineChart,
  NotepadText,
  PanelLeft,
  PanelRight,
  Quote,
  Settings,
  Target
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

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
      title: "Notes",
      url: "/notes",
      icon: NotepadText,
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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarRail />
      <SidebarHeader className="flex items-center gap-2 px-4">
        <BookOpen className="h-6 w-6 text-book-700" />
        <span className="group-data-[collapsible=icon]:hidden font-semibold text-lg">ReadFlow</span>
        <SidebarTrigger className="ml-auto h-8 w-8">
          {state === "expanded" ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
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
