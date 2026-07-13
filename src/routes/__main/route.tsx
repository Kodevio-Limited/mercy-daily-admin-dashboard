import { AppSidebar } from '@/components/main/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getModuleByPath, MODULE_KEYS, MODULES } from '@/lib/module'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'
import { motion, AnimatePresence } from 'motion/react'
import { motionTokens } from '@/lib/motionTokens'

export const Route = createFileRoute('/__main')({
    beforeLoad: async () => {
        const session = {
            user: {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'ADMIN',
                isDefault: true,
                image: '',
                phone: '',
            }
        }
        return session
    },
    component: RouteComponent,
})

// Derived breadcrumb labels from modules
const buildRouteLabels = (): Record<string, string> =>
    Object.fromEntries(MODULE_KEYS.map((id) => [MODULES[id].path, id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())]))

function RouteComponent() {
    const { user } = Route.useRouteContext()
    const pathname = useRouterState({ select: (s) => s.location.pathname })

    const routeLabels = buildRouteLabels()

    const segments = pathname.split('/').filter(Boolean)
    const crumbs = segments.map((_, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const id = getModuleByPath(href)
        const label = id ? routeLabels[href] : segments[index].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        return { href, label }
    })

    const isHome = pathname === '/'

    return (
        <SidebarProvider>
            <TooltipProvider>
                <AppSidebar user={user} />
                <SidebarInset>
                    <header className="sticky top-0 z-10 bg-background flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="-ml-1 text-primary" />
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                                Hello {user.name.split(' ')[0]} <span className="text-3xl">👋</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>
                                <div className="size-10 rounded-full overflow-hidden bg-muted">
                                    <img src={user.image || "/placeholder.jpg"} alt={user.name} className="size-full object-cover" />
                                </div>
                            </div>
                            <ModeToggle />
                        </div>
                    </header>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={pathname} 
                            className="flex flex-1 flex-col gap-4 p-4 sm:p-6 min-w-0 w-full"
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.99 }}
                            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </SidebarInset>
            </TooltipProvider>
        </SidebarProvider>
    )
}
