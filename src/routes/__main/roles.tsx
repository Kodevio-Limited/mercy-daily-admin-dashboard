import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, X } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/__main/roles')({
    component: RolesComponent,
})

const PERMISSIONS = [
    'Dashboard',
    'Users Management',
    'Push Notification',
    'Support',
    'Analytics',
    'Roles',
    'Settings',
]

const ROLES = ['Super Admin', 'Support Manager', 'Content Manager', 'Analyst']

// Default permissions matrix — Super Admin has everything
const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
    Dashboard:            { 'Super Admin': true,  'Support Manager': true,  'Content Manager': true,  Analyst: true  },
    'Users Management':   { 'Super Admin': true,  'Support Manager': true,  'Content Manager': false, Analyst: false },
    'Push Notification':  { 'Super Admin': true,  'Support Manager': true,  'Content Manager': false, Analyst: false },
    Support:              { 'Super Admin': true,  'Support Manager': true,  'Content Manager': false, Analyst: false },
    Analytics:            { 'Super Admin': true,  'Support Manager': false, 'Content Manager': false, Analyst: true  },
    Roles:                { 'Super Admin': true,  'Support Manager': false, 'Content Manager': false, Analyst: false },
    Settings:             { 'Super Admin': true,  'Support Manager': false, 'Content Manager': false, Analyst: false },
}

function RolesComponent() {
    const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS)
    const [draft, setDraft] = useState(DEFAULT_PERMISSIONS)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const handleEdit = () => {
        setDraft(JSON.parse(JSON.stringify(permissions))) // deep copy
        setIsEditing(true)
    }

    const handleCancel = () => {
        setDraft(JSON.parse(JSON.stringify(permissions)))
        setIsEditing(false)
    }

    const handleSave = () => {
        setPermissions(JSON.parse(JSON.stringify(draft)))
        setIsEditing(false)
        toast.success('Role permissions updated successfully.')
    }

    const togglePermission = (perm: string, role: string) => {
        setDraft((prev) => ({
            ...prev,
            [perm]: {
                ...prev[perm],
                [role]: !prev[perm][role],
            },
        }))
    }

    const current = isEditing ? draft : permissions

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <PageHeader
                    title="Roles"
                    description="Manage role-based access control for your team"
                />
                <Button className="w-full sm:w-auto shrink-0" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                </Button>
            </div>

            {/* Permissions Table — horizontal scroll on mobile */}
            <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                    <TableHeader className="bg-secondary/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[200px] min-w-[160px] font-semibold text-foreground py-4 px-4 border-r border-border">
                                Permission
                            </TableHead>
                            {ROLES.map((role, idx) => (
                                <TableHead
                                    key={role}
                                    className={`min-w-[130px] font-semibold text-foreground py-4 px-4 ${idx !== ROLES.length - 1 ? 'border-r border-border' : ''}`}
                                >
                                    {role}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PERMISSIONS.map((perm, rowIndex) => (
                            <TableRow
                                key={perm}
                                className={rowIndex % 2 !== 0 ? 'bg-secondary/10 hover:bg-secondary/20' : 'bg-card hover:bg-muted/30'}
                            >
                                <TableCell className="py-3.5 px-4 font-medium border-r border-border text-foreground/80 whitespace-nowrap">
                                    {perm}
                                </TableCell>
                                {ROLES.map((role, idx) => (
                                    <TableCell
                                        key={`${perm}-${role}`}
                                        className={`py-3.5 px-4 ${idx !== ROLES.length - 1 ? 'border-r border-border' : ''}`}
                                    >
                                        <Checkbox
                                            className="rounded-sm border-foreground/30 data-[state=checked]:border-primary"
                                            checked={current[perm][role]}
                                            disabled={!isEditing}
                                            onCheckedChange={() => togglePermission(perm, role)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit / Save Controls */}
            <div className="flex items-center justify-end gap-3">
                {isEditing ? (
                    <>
                        <Button variant="outline" onClick={handleCancel} className="gap-2">
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="gap-2">
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={handleEdit} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Permissions
                    </Button>
                )}
            </div>

            {/* Create Role Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-[#FCF7F2] border-[#E5D4C0]">
                    <DialogHeader className="px-6 py-5 border-b border-[#E5D4C0]/70 m-0">
                        <DialogTitle className="text-3xl font-extrabold text-[#38261A]">Create Role</DialogTitle>
                    </DialogHeader>

                    <div className="px-6 pb-6 pt-2 max-h-[80vh] overflow-y-auto space-y-5
                        [&_label]:text-[#38261A] [&_label]:text-[15px] [&_label]:font-medium [&_label]:mb-1.5 [&_label]:block
                        [&_input]:bg-transparent [&_input]:border-[#E5D4C0] [&_input]:focus-visible:ring-primary/20 [&_input]:placeholder:text-muted-foreground/60 [&_input]:h-11 [&_input]:text-base
                        [&_button[role=combobox]]:bg-transparent [&_button[role=combobox]]:border-[#E5D4C0] [&_button[role=combobox]]:h-11 [&_button[role=combobox]]:text-base
                    ">
                        <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input placeholder="Enter role name" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Assign Members</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your member name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="john">John Doe</SelectItem>
                                    <SelectItem value="jane">Jane Smith</SelectItem>
                                    <SelectItem value="mike">Mike Johnson</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Set Permissions</Label>
                            <div className="border border-[#E5D4C0] rounded-lg bg-transparent overflow-hidden">
                                {PERMISSIONS.map((perm, idx) => (
                                    <div key={perm} className={`flex items-center justify-between px-4 py-3 ${idx !== PERMISSIONS.length - 1 ? 'border-b border-[#E5D4C0]/50' : ''}`}>
                                        <span className="text-[#7B7169] text-[15px]">{perm}</span>
                                        <Switch 
                                            className="data-[state=checked]:bg-[#22C55E] data-[state=unchecked]:bg-[#978F88] h-5 w-9 [&>span]:size-4"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button 
                                variant="default"
                                className="w-full sm:w-40 h-11 bg-primary hover:bg-primary/90 text-white rounded-lg text-base font-medium shadow-sm"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
