export type User = {
    id: number
    name: string
    image: string
    email: string
    phone: string
    role: 'User' | 'Moderator'
    verification: 'Verified' | 'Unverified'
    status: 'Active' | 'Delete'
}

export let USERS: User[] = [
    { id: 1, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Active' },
    { id: 2, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mike', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'Moderator', verification: 'Unverified', status: 'Delete' },
    { id: 3, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emma', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Active' },
    { id: 4, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=James', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Delete' },
    { id: 5, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aisha', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Active' },
    { id: 6, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Carlos', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Active' },
    { id: 7, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Lisa', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Delete' },
    { id: 8, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Omar', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Active' },
    { id: 9, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=James2', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Delete' },
    { id: 10, name: 'Elena Rostova', image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Lisa2', email: 'Firoz1122@gmail.com', phone: '+0184532210152', role: 'User', verification: 'Verified', status: 'Active' },
]

export function getUserById(id: number): User | undefined {
    return USERS.find((u) => u.id === id)
}

export function createUser(data: Omit<User, 'id'>): User {
    const newUser = { id: Date.now(), ...data }
    USERS = [...USERS, newUser]
    return newUser
}

export function updateUser(id: number, data: Partial<User>): User | undefined {
    const index = USERS.findIndex((u) => u.id === id)
    if (index !== -1) {
        USERS[index] = { ...USERS[index], ...data }
        return USERS[index]
    }
    return undefined
}

export function toggleUserStatus(id: number): User | undefined {
    const index = USERS.findIndex((u) => u.id === id)
    if (index !== -1) {
        USERS[index] = { 
            ...USERS[index], 
            status: USERS[index].status === 'Active' ? 'Delete' : 'Active' 
        }
        return USERS[index]
    }
    return undefined
}

export function deleteUser(id: number): boolean {
    const initialLength = USERS.length
    USERS = USERS.filter((u) => u.id !== id)
    return USERS.length !== initialLength
}

