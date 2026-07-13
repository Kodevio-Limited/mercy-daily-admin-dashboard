import { getSupportTickets } from '@/lib/support'
import type { SupportTicket } from '@/lib/support'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/shared/data-table'
import type { DataTableColumn } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { SearchInput } from '@/components/shared/search-input'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, Pencil, Trash2, Headphones } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useSearchParams } from '@/hooks/use-search-params'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    tab: z.enum(['All Status', 'Open', 'Pending', 'Resolved']).catch('All Status').optional(),
    q: z.string().catch('').optional(),
})

export const Route = createFileRoute('/__main/support/')({
    component: RouteComponent,
    validateSearch: searchSchema,
})


const TABS = ['All Status', 'Open', 'Pending', 'Resolved'] as const

function RouteComponent() {
    const [tickets] = useState<SupportTicket[]>(getSupportTickets())
    
    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const activeTab = search.tab ?? 'All Status'
    const searchQuery = search.q ?? ''
    const page = search.page ?? 1
    const limit = search.limit ?? 10

    const setQuery = (q: string) => mergeSearch({ q, page: 1 })
    const setTab = (tab: typeof TABS[number]) => mergeSearch({ tab, page: 1 })

    const filteredTickets = useMemo(() => {
        let result = [...tickets]

        if (activeTab !== 'All Status') {
            result = result.filter((r) => r.status === activeTab)
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (r) =>
                    r.user.toLowerCase().includes(query) || 
                    r.issue.toLowerCase().includes(query) || 
                    r.id.toLowerCase().includes(query)
            )
        }

        return result
    }, [tickets, activeTab, searchQuery])

    const paginatedTickets = useMemo(() => {
        const start = (page - 1) * limit
        return filteredTickets.slice(start, start + limit)
    }, [filteredTickets, page, limit])

    const columns: DataTableColumn<SupportTicket>[] = useMemo(
        () => [
            {
                key: 'id',
                header: 'Ticket ID',
                className: 'font-medium',
                render: (t) => <span className="text-muted-foreground">{t.id}</span>,
            },
            { key: 'user', header: 'User', render: (t) => <span className="text-muted-foreground">{t.user}</span> },
            { key: 'issue', header: 'Issue', render: (t) => <span className="text-muted-foreground">{t.issue}</span> },
            { key: 'date', header: 'Date', render: (t) => <span className="text-muted-foreground">{t.date}</span> },
            {
                key: 'status',
                header: 'Status',
                render: (t) => {
                    if (t.status === 'Resolved') return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Resolved</span>
                    if (t.status === 'Pending') return <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">Pending</span>
                    return <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">Open</span>
                },
            },
            {
                key: 'action',
                header: 'Action',
                render: () => (
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="size-6 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 hover:text-orange-600">
                            <Eye className="size-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-6 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600">
                            <Pencil className="size-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-6 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600">
                            <Trash2 className="size-3" />
                        </Button>
                    </div>
                ),
            },
        ],
        []
    )

    return (
        <div className="flex flex-col gap-4 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <PageHeader title="Support" description="Manage support tickets and inquiries" />
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <SearchInput value={searchQuery} onValueChange={setQuery} placeholder="Search" className="w-full sm:w-[300px]" />
                </div>
            </div>

            {/* Status filter tabs — scrollable on mobile */}
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {TABS.map((tab) => (
                    <Button 
                        key={tab} 
                        variant={activeTab === tab ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTab(tab)}
                        className={`rounded-full shrink-0 px-4 h-8 text-xs font-medium ${
                            activeTab === tab 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary' 
                                : 'bg-transparent text-foreground hover:bg-muted/50 border-border'
                        }`}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            <DataTable
                columns={columns}
                data={paginatedTickets}
                total={filteredTickets.length}
                page={page}
                limit={limit}
                noun="tickets"
                emptyIcon={<Headphones className="h-6 w-6" />}
                onReset={() => mergeSearch({ q: '', tab: 'All Status', page: 1 })}
            />
        </div>
    )
}
