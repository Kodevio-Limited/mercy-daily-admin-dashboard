/**
 * Single source of truth for module identifiers, paths, and permissions.
 *
 * Each entry owns:
 *  - key:         kebab-case key (used for i18n namespaces, API payloads, permission map)
 *  - path:        the URL the module lives at
 *  - permissions: the set of permission keys valid for this module
 *
 * Order in MODULES = order in the sidebar / role matrix / form-module-map.
 *
 * To add a module:
 *   1. Add an entry here (key, path, permissions).
 *   2. Create a route file at the matching `path` under `src/routes/__main/`.
 *   3. Add an icon for it in `src/lib/module-icons.tsx`.
 *
 * Consumers (all derived — never duplicate the list elsewhere):
 *   - `app-sidebar.tsx`           → sidebar links
 *   - `__main/route.tsx`          → breadcrumb labels
 *   - `form-module-map.tsx`       → role permission matrix
 *   - `permission.tsx`            → hasRoutePermission
 */

// ---------- 1. Canonical permission keys (kebab-case, API-friendly) ----------
export const COMMON_PERMISSIONS = ['create', 'update'] as const

// ---------- 2. Module registry ----------
export const MODULES = {
    dashboard: {
        path: '/',
        permissions: ['stat-cards', 'revenue-overview', 'recent-bookings'],
    },
    'user-management': {
        path: '/user-management',
        permissions: COMMON_PERMISSIONS,
    },
    'daily-content': {
        path: '/daily-content',
        permissions: COMMON_PERMISSIONS,
    },
    'prayer-management': {
        path: '/prayer-management',
        permissions: COMMON_PERMISSIONS,
    },
    community: {
        path: '/community',
        permissions: COMMON_PERMISSIONS,
    },
    settings: {
        path: '/settings',
        permissions: COMMON_PERMISSIONS,
    },
} as const

// ---------- 3. Types ----------
export type ModuleKey = keyof typeof MODULES
export type ModuleConfig<TModule extends ModuleKey = ModuleKey> = (typeof MODULES)[TModule]
export type ModulePath<TModule extends ModuleKey = ModuleKey> = (typeof MODULES)[TModule]['path']
export type ModulePermission<TModule extends ModuleKey = ModuleKey> = (typeof MODULES)[TModule]['permissions'][number]

// ---------- 4. Iteration / lookup helpers ----------
export const MODULE_KEYS = Object.keys(MODULES) as ModuleKey[]

export const getModule = <TModule extends ModuleKey>(key: TModule): (typeof MODULES)[TModule] => MODULES[key]

export const getModuleByPath = (path: string): ModuleKey | undefined =>
    (MODULE_KEYS).find((key) => MODULES[key].path === path)
