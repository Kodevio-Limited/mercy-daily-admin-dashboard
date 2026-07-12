import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <Outlet />
        </main>
    )
}
