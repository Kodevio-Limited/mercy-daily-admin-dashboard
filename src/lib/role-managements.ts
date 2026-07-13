export type RoleItem = {
    id: number
    roleName: string
    employees: string
    modules: { moduleName: string; enabled: boolean; permissions?: string[] }[]
}

export const INITIAL_ROLES: RoleItem[] = [
    {
        id: 1,
        roleName: 'Manager',
        employees: 'Jane Cooper',
        modules: [
            { moduleName: 'Dashboard', enabled: true, permissions: ['StatCards', 'Revenue Overview'] },
            { moduleName: 'Users', enabled: true, permissions: ['Create', 'View'] },
            { moduleName: 'Daily Content', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Prayer Management', enabled: true, permissions: ['View', 'Update'] },
            { moduleName: 'Community', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Settings', enabled: true, permissions: ['Create', 'Update', 'View'] },
        ],
    },
    {
        id: 2,
        roleName: 'Super Admin',
        employees: 'Wade Warren',
        modules: [
            { moduleName: 'Dashboard', enabled: true, permissions: ['StatCards', 'Revenue Overview'] },
            { moduleName: 'Users', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Daily Content', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Prayer Management', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Community', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Settings', enabled: true, permissions: ['Create', 'Update', 'View'] },
        ],
    },
    {
        id: 3,
        roleName: 'Content Moderator',
        employees: 'Dianne Russell',
        modules: [
            { moduleName: 'Dashboard', enabled: true, permissions: ['StatCards'] },
            { moduleName: 'Daily Content', enabled: true, permissions: ['Create', 'Update', 'View'] },
            { moduleName: 'Community', enabled: true, permissions: ['Create', 'Update', 'View'] },
        ],
    },
    {
        id: 4,
        roleName: 'Customer Support',
        employees: 'Courtney Henry',
        modules: [
            { moduleName: 'Dashboard', enabled: true, permissions: ['StatCards'] },
            { moduleName: 'Users', enabled: true, permissions: ['View'] },
            { moduleName: 'Prayer Management', enabled: true, permissions: ['Create', 'Update', 'View', 'Resolve'] },
        ],
    },
    {
        id: 5,
        roleName: 'IT Administrator',
        employees: 'Cody Fisher',
        modules: [
            { moduleName: 'Dashboard', enabled: true, permissions: ['StatCards'] },
            { moduleName: 'Users', enabled: true, permissions: ['Create', 'Update', 'View', 'Delete'] },
            { moduleName: 'Settings', enabled: true, permissions: ['Create', 'Update', 'View', 'Delete'] },
        ],
    },
    {
        id: 6,
        roleName: 'Data Analyst',
        employees: 'Jerome Bell',
        modules: [
            { moduleName: 'Dashboard', enabled: true, permissions: ['StatCards', 'Revenue Overview'] },
            { moduleName: 'Users', enabled: true, permissions: ['View'] },
        ],
    },
]

export const addRole = (role: Omit<RoleItem, 'id'>) => {
    INITIAL_ROLES.push({ id: Date.now(), ...role })
}

export const updateRole = (id: number, role: Partial<RoleItem>) => {
    const index = INITIAL_ROLES.findIndex((r) => r.id === id)
    if (index !== -1) {
        INITIAL_ROLES[index] = { ...INITIAL_ROLES[index], ...role }
    }
}

export const deleteRole = (id: number) => {
    const index = INITIAL_ROLES.findIndex((r) => r.id === id)
    if (index !== -1) {
        INITIAL_ROLES.splice(index, 1)
    }
}
