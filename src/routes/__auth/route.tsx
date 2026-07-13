import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__auth')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className="min-h-screen w-full flex bg-[#F6F7F2] text-foreground">
            <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <img src="/auth-bg.png" alt="Auth background" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-[420px] flex flex-col items-center">
                    <img src="/mercy-logo.svg" alt="Mercy Logo" className="h-[60px] w-auto mb-10" />
                    <Outlet />
                </div>
            </div>
        </main>
    )
}
