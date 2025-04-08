import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50"
      onClick={toggleSidebar}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">
            <MobileMenuButton />
            {children}
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}
