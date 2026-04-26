'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Building2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApiRaceListItem } from '@/lib/api-types'
import { distancePillColors } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { isUserLoggedIn } from '@/lib/auth'

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
  const router = useRouter()
  const [liked, setLiked] = useState(race.isLiked)
  const [likeCount, setLikeCount] = useState(race.likeCount)
  const [isPending, setIsPending] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isUserLoggedIn()) {
      router.push('/login')
      return
    }

    if (isPending) return

    const nextLiked = !liked
    setLiked(nextLiked)
    setLikeCount((c) => c + (nextLiked ? 1 : -1))
    setIsPending(true)

    try {
      const res = nextLiked ? await api.likeRace(race.id) : await api.unlikeRace(race.id)
      setLiked(res.isLiked)
      setLikeCount(res.likeCount)
    } catch {
      setLiked(!nextLiked)
      setLikeCount((c) => c + (nextLiked ? -1 : 1))
    } finally {
      setIsPending(false)
    }
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

        <div className="flex items-center gap-2">
          <Button asChild className="flex-1 bg-amber text-foreground hover:bg-amber/90">
            <Link href={`/races/${race.id}`}>자세히 보기</Link>
          </Button>
          <button
            onClick={handleLike}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
              liked
                ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            )}
            aria-label={liked ? '좋아요 취소' : '좋아요'}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-red-500')} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
