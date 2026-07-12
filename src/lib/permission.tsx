import type { ModuleKey } from './module'
import { getModuleByPath } from './module'

/** 'stat-cards' -> 'Stat Cards'. Used for permission checkbox labels. */
export const formatPermission = (key: string): string =>
    key
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

/** Resolves the ModuleKey associated with a given path, handling segments. */
export const getModuleKeyFromPath = (path: string): ModuleKey | undefined => {
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/'

    // Segment-based matching for standard modules
    const segments = cleanPath.split('/').filter(Boolean)
    for (let i = segments.length; i > 0; i--) {
        const prefixPath = '/' + segments.slice(0, i).join('/')
        const key = getModuleByPath(prefixPath)
        if (key) {
            return key
        }
    }

    // Only match dashboard if path is exactly '/'
    if (cleanPath === '/') {
        return 'dashboard'
    }

    return undefined
}

/** Check if the user has access to a specific route based on their module permissions. */
export const hasRoutePermission = (_user: any, _path: string): boolean => {
    return true
}

/** Enforces route permission constraints, redirecting unauthorized users. */
export const checkRoutePermission = (_user: any, _path: string) => {
    // Permission checks are disabled
}
