import { useAppForm } from '@/components/form/form-context'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const searchSchema = z.object({
    user: z.email(),
    type: z.enum(['signup', 'reset']),
})

export const Route = createFileRoute('/__auth/verification')({
    validateSearch: searchSchema,
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { user, type } = Route.useSearch()
    const [resendDisabled, setResendDisabled] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setResendDisabled(false)
        }
    }, [countdown])

    const verifyOtpSchema = z.object({
        otp: z.string().min(6, 'Enter your 6 digit code'),
    })

    const verifySignup = useMutation({
        mutationFn: async (_payload: any) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
        },
        onSuccess: () => {
            toast.success('Email verified! Welcome aboard.')
            navigate({ to: '/' })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const verifyReset = useMutation({
        mutationFn: async (_payload: any) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
        },
        onSuccess: () => {
            toast.success('Code verified. Choose a new password.')
            navigate({ to: '/reset-password', search: { token: 'mock-token-123' } })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const resend = useMutation({
        mutationFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
        },
        onSuccess: () => {
            toast.success('A new code has been sent to your email.')
            setResendDisabled(true)
            setCountdown(60)
        },
        onError: () => toast.error('Failed to resend code. Please try again.'),
    })

    const form = useAppForm({
        defaultValues: { otp: '' },
        validators: { onChange: verifyOtpSchema },
        onSubmit: async ({ value }) => {
            const payload = { email: user, panel: 'owner' as const, otp: value.otp }
            if (type === 'signup') {
                await verifySignup.mutateAsync(payload)
            } else {
                await verifyReset.mutateAsync(payload)
            }
        },
    })

    return (
        <Card className="w-full max-w-[854px] min-h-[526px] mx-auto rounded-[20px] shadow-[0px_12px_50px_-12px_rgba(0,0,0,0.25)] border border-border/70 justify-center" style={{ backgroundColor: 'var(--auth-card)' }}>
            <CardContent className="py-0 w-full">
                <div className="max-w-[458px] mx-auto flex flex-col gap-6">
                    {/* Header */}
                    <div className="text-center flex flex-col gap-1">
                        <h1 className="text-3xl font-extrabold text-foreground">Verification</h1>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            We've sent a verification code to <span className="font-medium text-foreground">{user}</span>.
                            <br />
                            Please enter it below.
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
                        <div className="flex justify-center">
                            <form.AppField name="otp">{(field) => <field.FormInputOtp />}</form.AppField>
                        </div>

                        <form.AppForm>
                            <form.FormSubmit
                                label="Verify"
                                className="w-full h-12 text-base font-medium rounded-2xl shadow-[0px_12px_50px_0px_rgba(253,105,0,0.30)]"
                            />
                        </form.AppForm>
                    </form>

                    {/* Footer actions */}
                    <div className="flex flex-col items-center gap-2">
                        {countdown > 0 && (
                            <p className="text-center text-sm text-muted-foreground">
                                Code expires in {countdown} sec
                            </p>
                        )}
                        <p className="text-center text-sm text-muted-foreground">
                            Wrong email?{' '}
                            <Link to="/signin" className="text-primary font-medium hover:underline">
                                Edit
                            </Link>
                        </p>
                        {countdown === 0 && (
                            <button
                                type="button"
                                onClick={() => resend.mutate()}
                                disabled={resendDisabled || resend.isPending}
                                className="font-medium text-primary text-sm hover:underline disabled:opacity-50"
                            >
                                {resend.isPending ? 'Sending...' : 'Resend code'}
                            </button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
