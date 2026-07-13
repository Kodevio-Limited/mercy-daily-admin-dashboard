import { useAppForm } from '@/components/form/form-context'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { SlidersHorizontal, User, ShieldCheck, Camera, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'

export const Route = createFileRoute('/__main/settings')({
    component: RouteComponent,
})

const TABS = [
    { id: 'general', label: 'General', icon: SlidersHorizontal },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
] as const

type TabId = (typeof TABS)[number]['id']

// ─── Schemas ────────────────────────────────────────────────────────────────────

const profileSchema = z.object({
    image: z.string(),
    name: z.string().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
})

const generalSchema = z.object({
    appName: z.string().min(1, 'Enter App Name'),
    logoUrl: z.string(),
})

const securitySchema = z.object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Re-enter your new password'),
})

// ─── Main Component ─────────────────────────────────────────────────────────────

function RouteComponent() {
    const [activeTab, setActiveTab] = useState<TabId>('general')

    return (
        <>
            <PageHeader title="Settings" description="Configure your application preferences and integrations." />

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-5">
                {/* Left Sidebar Tabs */}
                <nav className="flex flex-row md:flex-col gap-2 bg-card border rounded-xl p-3 h-fit overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                                onClick={() => setActiveTab(tab.id)}
                                className={`justify-start gap-3 h-11 ${activeTab === tab.id ? 'bg-muted/50' : ''}`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </Button>
                        )
                    })}
                </nav>

                {/* Right Content Area */}
                <div className="border rounded-xl bg-card p-6 min-h-[500px]">
                    {activeTab === 'general' && <GeneralTab />}
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'security' && <SecurityTab />}
                </div>
            </div>
        </>
    )
}

// ─── General Tab ────────────────────────────────────────────────────────────────

function GeneralTab() {
    const form = useAppForm({
        defaultValues: { appName: '', logoUrl: '' },
        validators: { onChange: generalSchema },
        onSubmit: async ({ value }) => {
            console.log('General saved:', value)
            toast.success("Settings saved successfully")
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-5 h-full"
        >
            <div>
                <h3 className="text-xl font-semibold text-foreground">General</h3>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-5 max-w-2xl">
                <form.AppField name="appName">
                    {(field) => (
                        <field.FormInput
                            label="App Name"
                            placeholder="Enter App Name"
                        />
                    )}
                </form.AppField>

                <form.AppField name="logoUrl">
                    {(field) => (
                        <field.FormInput
                            label="Logo URL"
                            placeholder="Enter Logo URL"
                        />
                    )}
                </form.AppField>
            </div>

            <div className="mt-2">
                <form.AppForm>
                    <Button 
                        type="submit" 
                        variant="default"
                        disabled={form.state.isSubmitting}
                        className="w-full sm:w-[250px]"
                    >
                        Save
                    </Button>
                </form.AppForm>
            </div>
        </form>
    )
}

// ─── Profile Tab ────────────────────────────────────────────────────

function ProfileTab() {
    const { user } = Route.useRouteContext()

    const updateUser = useMutation({
        mutationFn: async (data: any) => {
            return { user: { ...user, ...data } }
        },
        onSuccess: () => {
            toast.success("Profile updated successfully")
        },
        onError: (error) => toast.error(error.message),
    })

    const form = useAppForm({
        defaultValues: {
            image: user.image,
            name: user.name,
            email: user.email,
        },
        validators: { onChange: profileSchema },
        onSubmit: async ({ value }) => {
            await updateUser.mutateAsync({
                name: value.name,
                image: value.image,
            })
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-5"
        >
            <div className="flex items-center gap-2 -ml-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="size-4" />
                </Button>
                <h3 className="text-xl font-semibold text-foreground">Profile</h3>
            </div>

            <Separator />

            {/* Avatar Upload */}
            <div className="flex justify-center my-4">
                <div className="relative group cursor-pointer inline-block">
                    <form.AppField name="image">{(field) => <field.FormAvatar folder="owner" />}</form.AppField>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center pointer-events-none">
                        <Camera className="size-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
                <form.AppField name="name">
                    {(field) => (
                        <div className="relative">
                            <field.FormInput label="Full Name" placeholder="Enter your name" />
                        </div>
                    )}
                </form.AppField>

                <form.AppField name="email">
                    {(field) => (
                        <div className="relative">
                            <field.FormInput
                                type="email"
                                label="Email Address"
                                placeholder="Enter your email"
                                readOnly
                            />
                        </div>
                    )}
                </form.AppField>
            </div>

            {/* Save Button */}
            <div className="mt-4">
                <form.AppForm>
                    <Button 
                        type="submit" 
                        variant="default"
                        disabled={form.state.isSubmitting}
                        className="w-full sm:w-[350px]"
                    >
                        Save
                    </Button>
                </form.AppForm>
            </div>
        </form>
    )
}

// ─── Security Tab ───────────────────────────────────────────────────────────────

function SecurityTab() {
    const [twoFactor, setTwoFactor] = useState(false)

    const changePassword = useMutation({
        mutationFn: async (_data: any) => {
            return { message: 'Password changed successfully' }
        },
        onSuccess: (data) => {
            toast.success(data.message)
            form.reset()
        },
        onError: (error) => toast.error(error.message),
    })

    const form = useAppForm({
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
        validators: { onChange: securitySchema },
        onSubmit: async ({ value }) => {
            await changePassword.mutateAsync({
                currentPassword: value.currentPassword,
                newPassword: value.newPassword,
                revokeOtherSessions: true,
            })
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-5"
        >
            <div>
                <h3 className="text-xl font-semibold text-foreground">Security</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Manage your password and security settings.</p>
            </div>

            <Separator />

            {/* Change Password */}
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 max-w-md">
                    <form.AppField name="currentPassword">
                        {(field) => (
                            <field.FormInput
                                type="password"
                                label={'Current Password'}
                                placeholder={'Current Password Placeholder'}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="newPassword">
                        {(field) => (
                            <field.FormInput
                                type="password"
                                label={'New Password'}
                                placeholder={'New Password Placeholder'}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="confirmPassword">
                        {(field) => (
                            <field.FormInput
                                type="password"
                                label={'Confirm Password'}
                                placeholder={'Confirm Password Placeholder'}
                            />
                        )}
                    </form.AppField>
                </div>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Two-Factor Authentication
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-6">Add an extra layer of security to your account.</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
            <div className="mt-4">
                <form.AppForm>
                    <Button 
                        type="submit" 
                        variant="default"
                        disabled={form.state.isSubmitting}
                        className="w-full sm:w-[250px]"
                    >
                        Save Changes
                    </Button>
                </form.AppForm>
            </div>
        </form>
    )
}
