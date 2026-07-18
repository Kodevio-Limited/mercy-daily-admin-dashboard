import { getSubscriptionPlans } from '@/lib/subscriptions'
import type { SubscriptionPlan } from '@/lib/subscriptions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/shared/page-header'
import { Switch } from '@/components/ui/switch'
import { createFileRoute } from '@tanstack/react-router'
import { CircleCheck, Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/__main/subscriptions')({
    component: SubscriptionsPage,
})


function SubscriptionsPage() {
    const plans = getSubscriptionPlans()
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)

    const handleSave = () => {
        toast.success('Plan updated successfully!')
        setEditingPlan(null)
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader title="Subscription Management" description="Manage plans, pricing, and subscriber data." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                    <Card
                        key={plan.id}
                        className={`flex flex-col border transition-shadow hover:shadow-md ${
                            i === 1
                                ? 'border-primary/40 ring-1 ring-primary/20 shadow-md'
                                : 'border-border/60'
                        }`}
                    >
                        {i === 1 && (
                            <div className="text-center py-1.5 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase rounded-t-xl border-b border-primary/20">
                                Most Popular
                            </div>
                        )}
                        <CardHeader className={i === 1 ? 'pt-4' : ''}>
                            <CardTitle className="text-lg font-medium text-foreground">{plan.name}</CardTitle>
                            <div className={`text-4xl font-bold ${plan.priceColor} mt-2 mb-1`}>{plan.price}</div>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 mt-6">
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CircleCheck className="h-5 w-5 text-green-500 shrink-0" />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center pt-6">
                            {plan.isActive ? (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                            
                            {plan.actionType === 'switch' ? (
                                <Switch checked={plan.isActive} />
                            ) : (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary hover:bg-primary/10 hover:text-primary"
                                    onClick={() => setEditingPlan(plan)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={editingPlan !== null} onOpenChange={(open) => !open && setEditingPlan(null)}>
                <DialogContent className="sm:max-w-112.5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-wide">Edit Plan</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-sm font-normal">Title</Label>
                            <Input 
                                defaultValue={editingPlan?.name} 
                                placeholder="Enter your title" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-sm font-normal">Monthly Price ($)</Label>
                            <Input 
                                defaultValue={editingPlan?.price.replace(/[^0-9.]/g, '')} 
                                placeholder="Enter your price" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-sm font-normal">Add Features</Label>
                            <div className="flex items-center gap-3">
                                <Input 
                                    placeholder="Enter your features" 
                                />
                                <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-md border border-input bg-transparent px-4 py-2">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Switch defaultChecked={editingPlan?.isActive} />
                        </div>

                        <Button 
                            variant="default"
                            className="w-full mt-4"
                            onClick={handleSave}
                        >
                            Save Plan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
