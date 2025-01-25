import { Calendar, PieChart, House, Search, Settings, BarChart, Users, PlusCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PieChart, 
  },
  {
    title: "Houses",
    url: "/houses",
    icon: House, 
  },
  {
    title: "Daily Records",
    url: "/daily-records",
    icon: Calendar, 
  },
  {
    title: "Stock",
    url: "/stock",
    icon: BarChart,
  },
  {
    title: "Feed Formula",
    url: "/feed-formula",
    icon: PlusCircle, 
  },
  {
    title: "Immunization",
    url: "/immunization",
    icon: Users, 
  },
  {
    title: "Diagnosis",
    url: "/diagnosis",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings, 
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 mt-3 text-lg font-bold text-slate-600">Poultry Pal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
