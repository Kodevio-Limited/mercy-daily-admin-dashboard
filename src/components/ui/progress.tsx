import * as React from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, { color: string }> = {
    Available: { color: 'var(--progress-available)' },
    Reserved: { color: 'var(--progress-reserved)' },
    Shipped: { color: 'var(--progress-shipped)' },
    Cleaning: { color: 'var(--progress-cleaning)' },
    Repair: { color: 'var(--progress-repair)' },
    Default: { color: 'var(--progress-default)' },
}

function Progress({ className, value, status, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { status?: string }) {
    const statusStyle = STATUS_STYLES[status!] ?? STATUS_STYLES.Default

    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn('relative flex h-4 w-full items-center overflow-x-hidden bg-muted rounded-full', className)}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn('size-full flex-1 transition-all')}
                style={{
                    backgroundColor: statusStyle.color,
                    transform: `translateX(-${100 - (value || 0)}%)`,
                }}
            />
        </ProgressPrimitive.Root>
    )
}

export { Progress }
