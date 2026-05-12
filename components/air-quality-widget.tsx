'use client'

import { useState, useEffect } from 'react'
import { Wind, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'
import type { AirQualityResponse } from '@/lib/api-types'

const GRADE_STYLES: Record<string, string> = {
  '좋음': 'bg-green-50 text-green-700 border-green-200',
  '보통': 'bg-amber-50 text-amber-700 border-amber-200',
  '나쁨': 'bg-orange-50 text-orange-700 border-orange-200',
  '매우나쁨': 'bg-red-50 text-red-700 border-red-200',
}

function parseAdvice(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <span key={i} className="block h-2" />
    const parts = line.split(/\*\*(.*?)\*\*/g)
    const nodes = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
    )
    return <span key={i} className="block">{nodes}</span>
  })
}

export function AirQualityWidget() {
  const [data, setData] = useState<AirQualityResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAdvice, setShowAdvice] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const result = await api.getAirQuality()
      setData(result)
    } catch {
      // 대기질 데이터는 부가 정보이므로 실패 시 조용히 숨김
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="animate-pulse rounded-xl border bg-card p-4">
          <div className="mb-3 h-4 w-36 rounded bg-muted" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 w-20 flex-shrink-0 rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">오늘의 서울 대기질</span>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.districts.map((district) => (
            <div
              key={district.name}
              className={`flex flex-shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${GRADE_STYLES[district.caiGrade] ?? 'border-border bg-muted text-muted-foreground'}`}
            >
              <span>{district.name}</span>
              <span className="opacity-60">{district.caiGrade}</span>
              <span className="font-bold">{district.cai}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAdvice((v) => !v)}
          className="mt-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {showAdvice ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          러닝 조언 {showAdvice ? '접기' : '보기'}
        </button>

        {showAdvice && (
          <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
            {parseAdvice(data.runningAdvice)}
          </div>
        )}
      </div>
    </div>
  )
}
