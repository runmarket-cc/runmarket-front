'use client'

import { cn } from '@/lib/utils'
import type { DistanceFilter, StatusFilter } from '@/lib/types'

interface FilterBarProps {
  distanceFilter: DistanceFilter
  statusFilter: StatusFilter
  onDistanceChange: (value: DistanceFilter) => void
  onStatusChange: (value: StatusFilter) => void
}

const distanceOptions: { value: DistanceFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: '5km', label: '5K' },
  { value: '10km', label: '10K' },
  { value: '하프', label: '하프' },
  { value: '풀', label: '풀' },
]

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '접수중' },
  { value: 'UPCOMING', label: '접수예정' },
  { value: 'CLOSED', label: '접수마감' },
]

export function FilterBar({
  distanceFilter,
  statusFilter,
  onDistanceChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
        <span className="mr-2 text-sm font-medium text-muted-foreground">
          거리
        </span>
        <div className="flex flex-wrap gap-2">
          {distanceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onDistanceChange(option.value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                distanceFilter === option.value
                  ? 'bg-navy text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mx-4 h-6 w-px bg-border" />

        <span className="mr-2 text-sm font-medium text-muted-foreground">
          상태
        </span>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                statusFilter === option.value
                  ? 'bg-navy text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
