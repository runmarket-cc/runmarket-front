'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { RunRoutePoint } from '@/lib/api-types'

interface RunRouteMapProps {
  route: RunRoutePoint[]
  color?: string
}

/**
 * 러닝 경로를 OpenStreetMap 타일 위에 폴리라인으로 렌더링한다.
 * Leaflet 은 window 에 의존하므로 클라이언트에서 동적 import 한다(SSR 회피).
 * 시작/종료 지점은 원형 마커(녹색/빨강)로 표시 — 이미지 아이콘을 쓰지 않아
 * 번들러 아이콘 경로 문제를 피한다.
 */
export function RunRouteMap({ route, color = '#ff9900' }: RunRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || route.length === 0) return

    let cancelled = false
    let map: import('leaflet').Map | null = null

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current) return

      const latlngs = route.map((p) => [p.lat, p.lng] as [number, number])

      map = L.map(containerRef.current, { attributionControl: true }).setView(latlngs[0], 15)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const line = L.polyline(latlngs, { color, weight: 4, opacity: 0.9 }).addTo(map)

      L.circleMarker(latlngs[0], {
        radius: 6, color: '#fff', weight: 2, fillColor: '#067d62', fillOpacity: 1,
      }).addTo(map).bindTooltip('시작')
      L.circleMarker(latlngs[latlngs.length - 1], {
        radius: 6, color: '#fff', weight: 2, fillColor: '#B12704', fillOpacity: 1,
      }).addTo(map).bindTooltip('도착')

      map.fitBounds(line.getBounds(), { padding: [24, 24] })
    })

    return () => {
      cancelled = true
      if (map) {
        map.remove()
        map = null
      }
    }
  }, [route, color])

  if (route.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-gray-50 text-sm text-gray-400">
        경로 데이터가 없습니다.
      </div>
    )
  }

  return <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-lg border" />
}
