import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useSearchParams } from '@/hooks/use-search-params'
import { CommunityUI } from '@/components/shared/community-ui'
import { COMMUNITY_GROUPS, createGroup, updateGroup, deleteGroup } from '@/lib/community'
import type { CommunityGroup } from '@/lib/community'
import type { FilterState } from '@/components/shared/filter-builder'
import * as z from 'zod'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    search: z.string().catch('').optional(),
    filters: z.string().catch('[]').optional(),
})

export const Route = createFileRoute('/__main/community')({
    validateSearch: searchSchema,
    component: CommunityPage,
})

function CommunityPage() {
    const { page = 1, limit = 10, search: searchQuery = '' } = Route.useSearch()
    const mergeSearch = useSearchParams()
    const [filters, setFilters] = useState<FilterState[]>([])

    // ----------------------------------------------------------------------
    // Filter and Search Logic
    // ----------------------------------------------------------------------
    const filteredContent = useMemo(() => {
        let result = COMMUNITY_GROUPS

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.category.toLowerCase().includes(query)
            )
        }

        if (filters.length > 0) {
            result = result.filter((content) => {
                for (const filter of filters) {
                    const { fieldId, condition, value } = filter
                    const contentValue = content[fieldId as keyof typeof content]

                    if (contentValue === undefined) continue

                    const valStr = String(contentValue).toLowerCase()
                    const filterValStr = String(value).toLowerCase()

                    if (!value && !['is empty', 'is not empty'].includes(condition)) {
                        continue
                    }

                    // --- empty checks ---
                    if (condition === 'is empty') {
                        if (valStr.trim() !== '') return false
                        continue
                    }
                    if (condition === 'is not empty') {
                        if (valStr.trim() === '') return false
                        continue
                    }

                    // --- date-specific ---
                    if (condition === 'is before') {
                        if (!value || valStr >= filterValStr) return false
                    } else if (condition === 'is after') {
                        if (!value || valStr <= filterValStr) return false
                    } else if (condition === 'is between') {
                        const [from, to] = Array.isArray(value) ? value : [value, '']
                        if (from && valStr < from) return false
                        if (to && valStr > to) return false
                    }
                    // --- generic ---
                    else if (condition === 'is exactly' || condition === 'is' || condition === '=') {
                        if (valStr !== filterValStr) return false
                    } else if (condition === 'is not exactly' || condition === 'is not' || condition === '!=') {
                        if (valStr === filterValStr) return false
                    } else if (condition === 'contains') {
                        if (!valStr.includes(filterValStr)) return false
                    } else if (condition === 'does not contain') {
                        if (valStr.includes(filterValStr)) return false
                    } else if (condition === 'starts with') {
                        if (!valStr.startsWith(filterValStr)) return false
                    } else if (condition === 'ends with') {
                        if (!valStr.endsWith(filterValStr)) return false
                    }
                }
                return true
            })
        }

        return result
    }, [searchQuery, filters])

    const paginatedContent = useMemo(() => {
        const start = (page - 1) * limit
        return filteredContent.slice(start, start + limit)
    }, [filteredContent, page, limit])

    const handleSearchChange = (value: string) => {
        mergeSearch({ search: value || undefined, page: 1 })
    }

    const handleResetSearch = () => {
        mergeSearch({ search: undefined, page: 1 })
        setFilters([])
    }
    
    const handleCreateGroup = (data: Omit<CommunityGroup, 'id' | 'createdAt'>) => {
        createGroup(data)
        // trigger re-render
        setFilters([...filters])
    }

    const handleUpdateGroup = (id: number, data: Partial<CommunityGroup>) => {
        updateGroup(id, data)
        // trigger re-render
        setFilters([...filters])
    }

    const handleDeleteGroup = (id: number) => {
        deleteGroup(id)
        // trigger re-render
        setFilters([...filters])
    }

    return (
        <CommunityUI
            groups={paginatedContent}
            totalGroups={filteredContent.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFiltersChange={(f) => {
                setFilters(f)
                mergeSearch({ page: 1 })
            }}
            onResetSearch={handleResetSearch}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
        />
    )
}
