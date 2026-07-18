import { useAppForm } from '@/components/form/form-context'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/__auth/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const signinSchema = z.object({
        email: z.email('Enter your email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(32, 'Password must be at most 32 characters'),
    })

    const signIn = useMutation({
        mutationFn: async (_payload: any) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            return { user: { emailVerified: true } }
        },
        onSuccess: async () => {
            navigate({ to: '/' })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const form = useAppForm({
        defaultValues: { email: '', password: '' },
        validators: { onChange: signinSchema },
        onSubmit: async ({ value }) => {
            await signIn.mutateAsync({
                email: value.email,
                panel: 'owner',
                password: value.password,
            })
        },
    })

    return (
        <div className="w-full flex flex-col gap-6">
            <h1 className="text-2xl font-medium text-foreground mb-4">Welcome Mercy</h1>

            <form
                className="flex flex-col gap-5"
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <form.AppField name="email">
                    {(field) => (
                        <field.FormInput
                            type="email"
                            label="Email Address"
                            placeholder="Enter Your Email"
                        />
                    )}
                </form.AppField>

                <form.AppField name="password">
                    {(field) => (
                        <field.FormInput
                            type="password"
                            label="Password"
                            iconRight={
                                <button type="button" className="focus:outline-none text-muted-foreground hover:text-foreground">
                                    <EyeOff className="w-4 h-4" />
                                </button>
                            }
                            placeholder="Type Your password"
                        />
                    )}
                </form.AppField>

                <div className="flex items-center justify-between py-2">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input type="checkbox" className="rounded-sm border-muted-foreground/30 text-[#555B51] focus:ring-[#555B51] bg-transparent" />
                        Remember me
                    </label>
                    <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-foreground hover:underline"
                    >
                        Forget Password
                    </Link>
                </div>

                <form.AppForm>
                    <form.FormSubmit
                        label="Sign in"
                        className="w-full h-12 text-base font-medium rounded-full bg-[#555B51] hover:bg-[#555B51]/90 text-white shadow-md border-none"
                    />
                </form.AppForm>
            </form>
        </div>
    )
}
