export type CommunityGroup = {
    id: number
    name: string
    category: string
    memberCount: number
    createdAt: string
    status: 'Active' | 'Inactive'
}

export let COMMUNITY_GROUPS: CommunityGroup[] = [
    {
        id: 1,
        name: 'Women of Faith',
        category: 'Discover',
        memberCount: 12000,
        createdAt: '2026-01-10T00:00:00Z',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Young Adults',
        category: 'My Church',
        memberCount: 125,
        createdAt: '2026-03-15T00:00:00Z',
        status: 'Active',
    },
    {
        id: 3,
        name: 'Parents in Prayer',
        category: 'Discover',
        memberCount: 642,
        createdAt: '2026-02-05T00:00:00Z',
        status: 'Active',
    },
    {
        id: 4,
        name: 'Men of Honor',
        category: 'Discover',
        memberCount: 890,
        createdAt: '2026-04-20T00:00:00Z',
        status: 'Inactive',
    },
    {
        id: 5,
        name: 'Bible Study Weekly',
        category: 'My Church',
        memberCount: 320,
        createdAt: '2026-05-11T00:00:00Z',
        status: 'Active',
    },
    {
        id: 6,
        name: 'Worship Team',
        category: 'My Church',
        memberCount: 45,
        createdAt: '2025-11-01T00:00:00Z',
        status: 'Active',
    },
    {
        id: 7,
        name: 'Marriage Retreat',
        category: 'Discover',
        memberCount: 150,
        createdAt: '2026-06-01T00:00:00Z',
        status: 'Inactive',
    },
    {
        id: 8,
        name: 'Youth Ministry',
        category: 'My Church',
        memberCount: 200,
        createdAt: '2025-08-15T00:00:00Z',
        status: 'Active',
    },
    {
        id: 9,
        name: 'Community Outreach',
        category: 'Discover',
        memberCount: 530,
        createdAt: '2026-01-22T00:00:00Z',
        status: 'Active',
    },
    {
        id: 10,
        name: 'Prayer Warriors',
        category: 'Answers',
        memberCount: 410,
        createdAt: '2026-03-30T00:00:00Z',
        status: 'Active',
    },
]

export function getGroupById(id: number): CommunityGroup | undefined {
    return COMMUNITY_GROUPS.find((g) => g.id === id)
}

export function createGroup(data: Omit<CommunityGroup, 'id' | 'createdAt'>): CommunityGroup {
    const newGroup: CommunityGroup = {
        ...data,
        id: Math.max(0, ...COMMUNITY_GROUPS.map((g) => g.id)) + 1,
        createdAt: new Date().toISOString(),
    }
    COMMUNITY_GROUPS.unshift(newGroup)
    return newGroup
}

export function updateGroup(id: number, data: Partial<CommunityGroup>): CommunityGroup | undefined {
    const index = COMMUNITY_GROUPS.findIndex((g) => g.id === id)
    if (index !== -1) {
        COMMUNITY_GROUPS[index] = { ...COMMUNITY_GROUPS[index], ...data }
        return COMMUNITY_GROUPS[index]
    }
    return undefined
}

export function deleteGroup(id: number): boolean {
    const initialLength = COMMUNITY_GROUPS.length
    COMMUNITY_GROUPS = COMMUNITY_GROUPS.filter((g) => g.id !== id)
    return COMMUNITY_GROUPS.length !== initialLength
}
