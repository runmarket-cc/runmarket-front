'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, Footprints } from 'lucide-react'
import { isUserLoggedIn } from '@/lib/auth'
import { api } from '@/lib/api'
import { RunCard } from '@/components/run-card'
import type { RunSummary } from '@/lib/api-types'
import { formatDistance } from '@/lib/run-format'

const PAGE_SIZE = 20

export default function RunsPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [runs, setRuns] = useState<RunSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.replace('/login')
      return
    }
    setReady(true)
    api.getUserRuns()
      .then(setRuns)
      .catch((e) => setError(e instanceof Error ? e.message : '러닝 기록을 불러오지 못했습니다'))
      .finally(() => setIsLoading(false))
  }, [router])

  // 무한 스크롤 (좋아요한 대회 목록과 동일한 Intersection Observer 패턴)
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || displayCount >= runs.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, runs.length))
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [runs.length, displayCount])

  if (!ready) return null

  const totalDistance = runs.reduce((sum, r) => sum + r.distanceKm, 0)
  const visibleRuns = runs.slice(0, displayCount)
  const hasMore = displayCount < runs.length

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
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : runs.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            <Footprints className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-muted-foreground">아직 러닝 기록이 없습니다.</p>
            <p className="mt-1 text-sm text-gray-400">앱에서 달리기를 시작하면 기록이 쌓여요.</p>
          </div>
        ) : (
          <>
            {/* 요약 통계 */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs text-gray-500">총 러닝</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">{runs.length}<span className="ml-1 text-sm font-semibold text-muted-foreground">회</span></p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs text-gray-500">누적 거리</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">{formatDistance(totalDistance)}<span className="ml-1 text-sm font-semibold text-muted-foreground">km</span></p>
              </div>
            </div>

            <div className="space-y-4">
              {visibleRuns.map((run) => (
                <RunCard key={run.id} run={run} />
              ))}
            </div>

            <div ref={sentinelRef} className="flex justify-center py-6">
              {hasMore && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
