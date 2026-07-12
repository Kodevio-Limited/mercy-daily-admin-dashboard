import { useAppForm } from '@/components/form/form-context'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Mail, Lock, EyeOff } from 'lucide-react'
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
        <Card className="w-full max-w-[854px] min-h-[526px] mx-auto rounded-[20px] shadow-[0px_12px_50px_-12px_rgba(0,0,0,0.25)] border border-border/70 justify-center">
            <CardContent className="py-0 w-full">
                <div className="max-w-[458px] mx-auto flex flex-col gap-6">
                    {/* Header */}
                    <div className="text-center flex flex-col gap-1">
                        <h1 className="text-3xl font-extrabold text-foreground">Login</h1>
                        <p className="text-base text-muted-foreground">
                            Your journey starts here. Log into your account
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className="flex flex-col gap-6"
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
                                    label="Email"
                                    icon={<Mail className="text-muted-foreground w-4 h-4" />}
                                    placeholder="Enter your email"
                                />
                            )}
                        </form.AppField>

                        <div className="flex flex-col gap-3.5">
                            <form.AppField name="password">
                                {(field) => (
                                    <field.FormInput
                                        type="password"
                                        label="Password"
                                        icon={<Lock className="text-muted-foreground w-4 h-4" />}
                                        iconRight={
                                            <button type="button" className="focus:outline-none">
                                                <EyeOff className="text-muted-foreground w-4 h-4" />
                                            </button>
                                        }
                                        placeholder="Enter your password"
                                    />
                                )}
                            </form.AppField>

                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-primary text-xs hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <form.AppForm>
                            <form.FormSubmit
                                label="Login"
                                className="w-full h-12 text-base font-medium rounded-2xl shadow-[0px_12px_50px_0px_rgba(253,105,0,0.30)]"
                            />
                        </form.AppForm>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
