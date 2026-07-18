import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/data-table'
import type { DataTableColumn } from '@/components/shared/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/page-header'
import { SearchInput } from '@/components/shared/search-input'
import { createFileRoute} from '@tanstack/react-router'
import { Eye, CreditCard } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { PAYMENTS  } from '#/lib/payments'
import type {Payment} from '#/lib/payments';

import { useSearchParams } from '@/hooks/use-search-params'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
})

export const Route = createFileRoute('/__main/payments')({
    component: RouteComponent,
    validateSearch: searchSchema,
})

function RouteComponent() {
    const [payments] = useState<Payment[]>(PAYMENTS)
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const page = search.page ?? 1
    const limit = search.limit ?? 10
    const searchQuery = search.q ?? ''

    const setQuery = (q: string) => mergeSearch({ q, page: 1 })

    const openDetails = useCallback((payment: Payment) => {
        setSelectedPayment(payment)
        setIsDetailsOpen(true)
    }, [])

    const filteredPayments = useMemo(() => {
        if (!searchQuery.trim()) return payments
        const query = searchQuery.toLowerCase()
        return payments.filter(
            (p) =>
                p.userName.toLowerCase().includes(query) ||
                p.plan.toLowerCase().includes(query) ||
                p.amount.toLowerCase().includes(query) ||
                p.method.toLowerCase().includes(query) ||
                p.period.toLowerCase().includes(query) ||
                p.status.toLowerCase().includes(query)
        )
    }, [payments, searchQuery])

    const paginatedPayments = useMemo(() => {
        const from = (page - 1) * limit
        const to = page * limit
        return filteredPayments.slice(from, to)
    }, [filteredPayments, page, limit])

    const columns: DataTableColumn<Payment>[] = useMemo(
        () => [
            {
                key: 'userName',
                header: 'User Name',
                className: 'font-medium',
                render: (p) => <span className="text-muted-foreground">{p.userName}</span>,
            },
            { key: 'plan', header: 'Plan', render: (p) => <span className="text-muted-foreground">{p.plan}</span> },
            { key: 'amount', header: 'Amount', render: (p) => <span className="text-muted-foreground">{p.amount}</span> },
            { key: 'method', header: 'Method', render: (p) => <span className="text-muted-foreground">{p.method}</span> },
            { key: 'period', header: 'Period', render: (p) => <span className="text-muted-foreground">{p.period}</span> },
            {
                key: 'status',
                header: 'Status',
                render: (p) => {
                    if (p.status === 'Paid') return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Paid</span>
                    if (p.status === 'Pending') return <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">Pending</span>
                    return <span className="inline-flex items-center rounded-md bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-500/20">Failed</span>
                },
            },
            {
                key: 'action',
                header: 'Action',
                render: (p) => (
                    <Button size="icon" variant="ghost" onClick={() => openDetails(p)} className="size-8 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600">
                        <Eye className="size-4" />
                    </Button>
                ),
            },
        ],
        [openDetails]
    )

    return (
        <div className="flex flex-col gap-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader title="Payments" description="Manage your payments" />
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <SearchInput value={searchQuery} onValueChange={setQuery} placeholder="Search" className="w-full sm:max-w-xs" />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={paginatedPayments}
                total={filteredPayments.length}
                page={page}
                limit={limit}
                noun="payments"
                emptyIcon={<CreditCard className="h-6 w-6" />}
                onReset={() => mergeSearch({ q: '', page: 1 })}
            />

            <PaymentDetailsDialog
                payment={selectedPayment}
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </div>
    )
}

function PaymentDetailsDialog({ payment, isOpen, onOpenChange }: { payment: Payment | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    if (!payment) return null

    const total = parseInt(payment.amount.replace('$', '')) || 0
    const base = Math.floor(total * 0.8)
    const service = total - base

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Paid':
                return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-0.5 text-sm font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Paid</span>
            case 'Pending':
                return <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2.5 py-0.5 text-sm font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">Pending</span>
            case 'Failed':
                return <span className="inline-flex items-center rounded-md bg-red-500/10 px-2.5 py-0.5 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20">Failed</span>
            default:
                return null
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-112.5">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Payment Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-2">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">#PAY-1234{payment.id}</h3>
                        <div className="mt-2">
                            {getStatusBadge(payment.status)}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-xl border border-border">
                            <div className="text-sm text-muted-foreground mb-1">User</div>
                            <div className="font-semibold text-base text-foreground">{payment.userName}</div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-xl border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Plan</div>
                            <div className="font-semibold text-base text-foreground">{payment.plan}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <div className="text-sm text-muted-foreground mb-1">Method</div>
                                <div className="font-semibold text-base text-foreground">{payment.method}</div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <div className="text-sm text-muted-foreground mb-1">Date</div>
                                <div className="font-semibold text-base text-foreground">20 April 2026</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-foreground mb-3">Bill Breakdown</h3>
                        <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subscription Fee</span>
                                <span className="text-foreground">${base}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taxes</span>
                                <span className="text-foreground">${service}</span>
                            </div>
                            <div className="border-t border-dashed border-border pt-3 flex justify-between font-semibold text-sm">
                                <span className="text-foreground">Total fee</span>
                                <span className="text-foreground">{payment.amount}</span>
                            </div>
                        </div>
                    </div>

                    <Button 
                        variant="default" 
                        onClick={() => toast.success('Invoice downloaded!')} 
                        className="w-full h-12 mt-2 text-base font-medium shadow-sm"
                    >
                        Download Invoice
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
