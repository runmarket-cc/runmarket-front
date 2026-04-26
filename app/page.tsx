'use client'

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Loader2, ChevronUp } from 'lucide-react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { FilterBar } from '@/components/filter-bar'
import { RaceCard } from '@/components/race-card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { ApiRaceListItem } from '@/lib/api-types'
import type { DistanceFilter, StatusFilter } from '@/lib/types'

const PAGE_SIZE = 20
const STANDARD_DISTANCES = ['5km', '10km', '하프', '풀']

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>(
    (searchParams.get('distance') as DistanceFilter) ?? 'ALL'
  )
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) ?? 'ALL'
  )

  const [races, setRaces] = useState<ApiRaceListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadRaces = async () => {
    try {
      const data = await api.getRaces()
      setRaces(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : '대회 목록을 불러오는데 실패했습니다'
      setError(message)
    }
  }

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true)
      setError(null)
      await loadRaces()
      setIsLoading(false)
    }
    fetchInitial()
  }, [])

  // URL 동기화 (검색어는 300ms 디바운스)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (distanceFilter !== 'ALL') params.set('distance', distanceFilter)
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, distanceFilter, statusFilter, router, pathname])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filteredRaces = useMemo(() => {
    setDisplayCount(PAGE_SIZE)
    return races.filter((race) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = race.name.toLowerCase().includes(query)
        const matchesRegion = race.region.toLowerCase().includes(query)
        const matchesVenue = race.venue.toLowerCase().includes(query)
        if (!matchesName && !matchesRegion && !matchesVenue) return false
      }

      if (distanceFilter !== 'ALL') {
        if (distanceFilter === '기타') {
          const isStandard = race.courses.some((c) =>
            STANDARD_DISTANCES.some((d) => c.toLowerCase().includes(d.toLowerCase()))
          )
          if (isStandard) return false
        } else {
          const hasMatchingCourse = race.courses.some((c) =>
            c.toLowerCase().includes(distanceFilter.toLowerCase())
          )
          if (!hasMatchingCourse) return false
        }
      }

      if (statusFilter !== 'ALL' && race.registrationStatus !== statusFilter) return false

      return true
    })
  }, [races, searchQuery, distanceFilter, statusFilter])

  const visibleRaces = useMemo(
    () => filteredRaces.slice(0, displayCount),
    [filteredRaces, displayCount]
  )

  const hasMore = displayCount < filteredRaces.length

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filteredRaces.length))
  }, [filteredRaces.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero />
      <FilterBar
        distanceFilter={distanceFilter}
        statusFilter={statusFilter}
        onDistanceChange={setDistanceFilter}
        onStatusChange={setStatusFilter}
      />

      <main id="races-section" className="mx-auto max-w-7xl px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setError(null)
                setIsLoading(true)
                loadRaces().finally(() => setIsLoading(false))
              }}
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredRaces.length}개</span>의 대회
            </p>

            {filteredRaces.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleRaces.map((race) => (
                    <RaceCard key={race.id} race={race} />
                  ))}
                </div>

                <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
                  {hasMore && (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  )}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">검색 조건에 맞는 대회가 없습니다.</p>
              </div>
            )}
          </>
        )}
      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg transition-opacity hover:opacity-80"
          aria-label="맨 위로"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
