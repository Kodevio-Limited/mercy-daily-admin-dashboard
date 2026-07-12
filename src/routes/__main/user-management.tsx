import { useSearchParams } from '@/hooks/use-search-params'
import { createFileRoute } from '@tanstack/react-router'
import type { FilterState } from '@/components/shared/filter-builder'
import { useMemo, useState } from 'react'
import * as z from 'zod'
import { USERS, createUser, updateUser, toggleUserStatus, deleteUser } from '#/lib/users'
import type { User } from '#/lib/users'
import { UserManagementUI, userSchema } from '@/components/shared/user-management-ui'

const searchSchema = z.object({
    page: z.number().catch(1).optional(),
    limit: z.number().catch(10).optional(),
    q: z.string().catch('').optional(),
    filters: z.string().catch('[]').optional(),
})

export const Route = createFileRoute('/__main/user-management')({
    validateSearch: searchSchema,
    component: RouteComponent,
})

function RouteComponent() {
    // ----------------------------------------------------------------------
    // 1. DATA FETCHING & STATE MANAGEMENT (The "Container" responsibilities)
    // ----------------------------------------------------------------------
    const [users, setUsers] = useState<User[]>(USERS)
    const search = Route.useSearch()
    const mergeSearch = useSearchParams()

    const page = search.page ?? 1
    const limit = search.limit ?? 10
    const searchQuery = search.q ?? ''
    const filters: FilterState[] = useMemo(() => {
        try {
            return JSON.parse(search.filters ?? '[]')
        } catch {
            return []
        }
    }, [search.filters])

    const setQuery = (q: string) => mergeSearch({ q, page: 1 })
    const setFilters = (newFilters: FilterState[]) => mergeSearch({ filters: JSON.stringify(newFilters), page: 1 })
    const resetSearch = () => mergeSearch({ q: '', filters: '[]', page: 1 })

    // ----------------------------------------------------------------------
    // 2. DATA MUTATIONS (The "Container" responsibilities)
    // ----------------------------------------------------------------------
    const handleSaveUser = (id: number | null, values: z.infer<typeof userSchema>) => {
        if (id) {
            updateUser(id, values)
        } else {
            createUser(values)
        }
        // In a real app, you would invalidate the react-query cache here.
        setUsers([...USERS])
    }

    const handleToggleStatus = (id: number) => {
        toggleUserStatus(id)
        setUsers([...USERS])
    }

    const handleDeleteUser = (id: number) => {
        deleteUser(id)
        setUsers([...USERS])
    }

    // ----------------------------------------------------------------------
    // 3. DATA PROCESSING (Filtering & Pagination)
    // ----------------------------------------------------------------------
    const filteredUsers = useMemo(() => {
        let result = users

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query) ||
                    u.phone.toLowerCase().includes(query)
            )
        }

        if (filters.length > 0) {
            result = result.filter((user) => {
                for (const filter of filters) {
                    const { fieldId, condition, value } = filter
                    const userValue = user[fieldId as keyof typeof user]

                    if (userValue === undefined) continue

                    const valStr = String(userValue).toLowerCase()
                    const filterValStr = String(value).toLowerCase()

                    if (!value && !['is empty', 'is not empty'].includes(condition)) {
                        continue
                    }

                    // --- empty checks (apply to all types) ---
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
    }, [users, searchQuery, filters])

    const paginatedUsers = useMemo(() => {
        const from = (page - 1) * limit
        const to = page * limit
        return filteredUsers.slice(from, to)
    }, [filteredUsers, page, limit])

    // ----------------------------------------------------------------------
    // 4. PRESENTATION (Rendering the extracted UI Component)
    // ----------------------------------------------------------------------
    return (
        <UserManagementUI
            users={paginatedUsers}
            totalUsers={filteredUsers.length}
            page={page}
            limit={limit}
            searchQuery={searchQuery}
            onSearchChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onResetSearch={resetSearch}
            onSaveUser={handleSaveUser}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={handleDeleteUser}
        />
    )
}
