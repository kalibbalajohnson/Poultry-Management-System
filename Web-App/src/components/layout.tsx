import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user') || 'null');
    });

    useEffect(() => {
        if (!user?.uid) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem('user') || 'null'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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