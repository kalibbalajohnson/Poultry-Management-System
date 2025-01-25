import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-grow overflow-y-auto w-full">
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
};

export default Layout;


