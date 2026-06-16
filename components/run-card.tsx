import Link from 'next/link'
import { Clock, Gauge, ChevronRight } from 'lucide-react'
import type { RunSummary } from '@/lib/api-types'
import { formatDistance, formatDuration, formatPace, formatRunDate } from '@/lib/run-format'

interface RunCardProps {
  run: RunSummary
}

export function RunCard({ run }: RunCardProps) {
  return (
    <Link
      href={`/mypage/runs/${run.id}`}
      className="block overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{formatRunDate(run.startedAt)}</p>
            <p className="mt-0.5 text-2xl font-extrabold leading-none text-foreground">
              {formatDistance(run.distanceKm)}
              <span className="ml-1 text-base font-semibold text-muted-foreground">km</span>
            </p>
          </div>
          <span
            className="mt-1 h-3 w-3 shrink-0 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: run.color || '#ff9900' }}
            aria-hidden
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0" />
            {formatDuration(run.durationSec)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-4 w-4 shrink-0" />
            {formatPace(run.avgPaceSecPerKm)} <span className="text-xs">/km</span>
          </span>
          <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
        </div>
      </div>
    </Link>
  )
}
