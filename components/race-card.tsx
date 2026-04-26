'use client'

import Link from 'next/link'
import { MapPin, Calendar, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApiRaceListItem } from '@/lib/api-types'
import { distancePillColors } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RaceCardProps {
  race: ApiRaceListItem
}

const statusLabels: Record<string, string> = {
  OPEN: '접수중',
  UPCOMING: '접수예정',
  CLOSED: '접수마감',
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-status-green text-white',
  UPCOMING: 'bg-status-amber text-white',
  CLOSED: 'bg-status-gray text-white',
}

export function RaceCard({ race }: RaceCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-balance text-lg font-bold text-foreground leading-snug">{race.name}</h3>
          <Badge className={cn('shrink-0 border-0', statusColors[race.registrationStatus])}>
            {statusLabels[race.registrationStatus]}
          </Badge>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {race.courses.map((course) => (
            <span
              key={course}
              className={cn(
                'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                distancePillColors[course] || 'bg-gray-400 text-white'
              )}
            >
              {course}
            </span>
          ))}
        </div>

        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{race.region} · {race.venue}</span>
        </div>

        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDate(race.date)}</span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{race.organizer}</span>
        </div>

        <Button asChild className="w-full bg-amber text-foreground hover:bg-amber/90">
          <Link href={`/races/${race.id}`}>자세히 보기</Link>
        </Button>
      </div>
    </div>
  )
}
