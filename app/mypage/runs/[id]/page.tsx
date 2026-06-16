'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, Clock, Gauge, Route, CalendarDays } from 'lucide-react'
import { isUserLoggedIn } from '@/lib/auth'
import { api } from '@/lib/api'
import { RunRouteMap } from '@/components/run-route-map'
import type { RunDetail } from '@/lib/api-types'
import {
  formatDistance, formatDuration, formatPace, formatRunDate, formatRunTime,
} from '@/lib/run-format'

export default function RunDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [ready, setReady] = useState(false)
  const [run, setRun] = useState<RunDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.replace('/login')
      return
    }
    setReady(true)
    api.getUserRun(id)
      .then(setRun)
      .catch((e) => setError(e instanceof Error ? e.message : '러닝 기록을 불러오지 못했습니다'))
      .finally(() => setIsLoading(false))
  }, [router, id])

  if (!ready) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-navy px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button
            onClick={() => router.back()}
            className="text-amber transition-opacity hover:opacity-80"
            aria-label="뒤로"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Link href="/" className="text-xl font-extrabold text-amber">런마켓</Link>
          <span className="text-sm text-white/50">/ 러닝 기록</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error || !run ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error ?? '러닝 기록을 찾을 수 없습니다.'}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* 헤더: 날짜 + 거리 */}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{formatRunDate(run.startedAt)} · {formatRunTime(run.startedAt)}</span>
              </div>
              <p className="mt-1 text-4xl font-extrabold text-foreground">
                {formatDistance(run.distanceKm)}
                <span className="ml-1.5 text-xl font-semibold text-muted-foreground">km</span>
              </p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={<Clock className="h-4 w-4" />} label="시간" value={formatDuration(run.durationSec)} />
              <Stat icon={<Gauge className="h-4 w-4" />} label="평균 페이스" value={`${formatPace(run.avgPaceSecPerKm)} /km`} />
            </div>

            {/* 경로 지도 */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Route className="h-4 w-4" />
                경로
              </div>
              <RunRouteMap route={run.route} color={run.color || '#ff9900'} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}
