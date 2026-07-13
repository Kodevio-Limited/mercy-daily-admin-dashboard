'use client'

import { NavMain } from '@/components/main/nav-main'
import { NavUser } from '@/components/main/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { MODULES, MODULE_KEYS } from '@/lib/module'
import { MODULE_ICONS } from '@/lib/module-icons'

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: any }) {
    // Derived from module keys
    const navMain = MODULE_KEYS.map((key) => {
        const Icon = MODULE_ICONS[key]
        return {
            key,
            title: key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            url: MODULES[key].path,
            icon: <Icon className="size-4" />,
        }
    })

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="px-4 py-3 group-data-[collapsible=icon]:!px-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default px-5 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:justify-center">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg group-data-[collapsible=icon]:mx-auto">
                                <img src="/favicon.svg" alt="Icon" className="size-full object-contain hidden group-data-[collapsible=icon]:block" />
                            </div>
                            <img src="/mercy-logo.svg" alt="Logo" className="h-11 w-auto object-contain group-data-[collapsible=icon]:hidden -ml-2" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} user={user} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
