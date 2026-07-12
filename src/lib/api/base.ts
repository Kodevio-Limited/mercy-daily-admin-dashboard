

export const baseURL = import.meta.env.VITE_APP_SERVER as string
export const apiPrefix = '/api/v1'

export type Paginated<T> = {
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
    console.log(`Mocking backend request to ${path}`, init)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (path.includes('?')) {
        return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } } as T
    }

    return { data: {} } as T
}

export function toQuery(params: Record<string, string | number | boolean | undefined>) {
    const usp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === '') continue
        usp.set(k, String(v))
    }
    const s = usp.toString()
    return s ? `?${s}` : ''
}

export function resolveImage(image: string | null | undefined): string {
    if (!image) return '/placeholder.jpg'
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    if (image.startsWith('/uploads/')) return `${baseURL}${image}`
    return image
}
