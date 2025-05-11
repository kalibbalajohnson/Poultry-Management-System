import * as React from "react"
import { useEffect, useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { Calendar, PieChart, PlusCircle, House, Search, Settings, BarChart, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const fullNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PieChart,
    isActive: true,
  },
  {
    title: "Birds and Housing",
    url: "",
    icon: House,
    items: [
      {
        title: "Birds",
        url: "/birds",
      },
      {
        title: "Housing",
        url: "/houses",
      },
    ],
  },
  {
    title: "Production",
    url: "/production",
    icon: Calendar,
  },
  {
    title: "Stock",
    url: "/stock",
    icon: BarChart,
  },
  {
    title: "Immunization",
    url: "/immunization",
    icon: PlusCircle,
  },

  {
    title: "Disease Diagnosis",
    url: "/diagnosis",
    icon: Search,
  },
  {
    title: "Staff",
    url: "/staff",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const workerNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PieChart,
    isActive: true,
  },
  {
    title: "Production",
    url: "/production",
    icon: Calendar,
  },
  {
    title: "Stock",
    url: "/stock",
    icon: BarChart,
  },
  {
    title: "Immunization",
    url: "/immunization",
    icon: PlusCircle,
  },
  {
    title: "Disease Diagnosis",
    url: "/diagnosis",
    icon: Search,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [menuItems, setMenuItems] = useState(fullNav)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.role === "Worker") {
        setMenuItems(workerNav)
      } else {
        setMenuItems(fullNav)
      }
    }
  }, [])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">PoultryPal</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <a href={item.url} className="font-medium">
                    {item.icon && <item.icon className="mr-2 size-4" />}
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={`${subItem.title}-${subItem.url}`}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}