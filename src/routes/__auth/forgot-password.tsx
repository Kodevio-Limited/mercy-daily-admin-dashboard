import { useAppForm } from '@/components/form/form-context'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/__auth/forgot-password')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    const forgotSchema = z.object({
        email: z.email('Enter your email address'),
    })

    const forgot = useMutation({
        mutationFn: async (_payload: any) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
        },
        onSuccess: () => {
            toast.success('A new code has been sent to your email.')
            navigate({ to: '/verification', search: { user: form.state.values.email, type: 'reset' } })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const form = useAppForm({
        defaultValues: { email: '' },
        validators: { onChange: forgotSchema },
        onSubmit: async ({ value }) => {
            await forgot.mutateAsync({
                email: value.email,
                panel: 'owner',
            })
        },
    })

    return (
        <Card className="w-full max-w-[854px] min-h-[526px] mx-auto rounded-[20px] shadow-[0px_12px_50px_-12px_rgba(0,0,0,0.25)] border border-border/70 justify-center">
            <CardContent className="py-0 w-full">
                <div className="max-w-[458px] mx-auto flex flex-col gap-6">
                    {/* Header */}
                    <div className="text-center flex flex-col gap-1">
                        <h1 className="text-3xl font-extrabold text-foreground">Forgot Password</h1>
                        <p className="text-base text-muted-foreground">
                            Enter your email and we'll send you a password reset link.
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

                        <form.AppForm>
                            <form.FormSubmit
                                label="Send Reset Link"
                                className="w-full h-12 text-base font-medium rounded-2xl shadow-[0px_12px_50px_0px_rgba(253,105,0,0.30)]"
                            />
                        </form.AppForm>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <Link to="/signin" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
