// 러닝 기록 표시용 포맷 헬퍼

/** 거리(km) → "12.34" */
export function formatDistance(km: number): string {
  return km.toFixed(2)
}

/** 소요 시간(초) → "1:23:45" 또는 "23:45" */
export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`
}

/** 페이스(초/km) → "5:30" (0 이하면 "--:--") */
export function formatPace(secPerKm: number): string {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return '--:--'
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** ISO 날짜 → "2026년 6월 15일" */
export function formatRunDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** ISO 날짜 → "오후 2:30" 형태 시각 */
export function formatRunTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
