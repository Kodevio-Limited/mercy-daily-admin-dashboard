import {
    LayoutDashboard,
    UsersRound,
    ClipboardList,
    HandHeart,
    Users,
    Settings
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';
import type { ModuleKey } from './module'

/**
 * Icon mapping for each module. Keyed by ModuleKey so the type system enforces
 * that every module has an icon. Add a new entry here when you add a module.
 */
export const MODULE_ICONS: Record<ModuleKey, LucideIcon> = {
    dashboard: LayoutDashboard,
    'user-management': UsersRound,
    'daily-content': ClipboardList,
    'prayer-management': HandHeart,
    community: Users,
    settings: Settings,
}
