'use client'

import { useState, useMemo, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { FilterBar } from '@/components/filter-bar'
import { RaceCard } from '@/components/race-card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { ApiRaceListItem } from '@/lib/api-types'
import type { DistanceFilter, StatusFilter } from '@/lib/types'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const [races, setRaces] = useState<ApiRaceListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const filteredRaces = useMemo(() => {
    return races.filter((race) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = race.name.toLowerCase().includes(query)
        const matchesRegion = race.region.toLowerCase().includes(query)
        const matchesVenue = race.venue.toLowerCase().includes(query)
        if (!matchesName && !matchesRegion && !matchesVenue) {
          return false
        }
      }

      if (distanceFilter !== 'ALL') {
        const hasMatchingCourse = race.courses.some((c) =>
          c.toLowerCase().includes(distanceFilter.toLowerCase())
        )
        if (!hasMatchingCourse) return false
      }

      if (statusFilter !== 'ALL' && race.registrationStatus !== statusFilter) {
        return false
      }

      return true
    })
  }, [races, searchQuery, distanceFilter, statusFilter])

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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRaces.map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  검색 조건에 맞는 대회가 없습니다.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
