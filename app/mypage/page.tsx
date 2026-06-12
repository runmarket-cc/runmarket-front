'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Mail, ShieldCheck, Trash2, Loader2 } from 'lucide-react'
import { isUserLoggedIn, getUserEmail } from '@/lib/auth'
import { api } from '@/lib/api'
import type { ApiRaceListItem } from '@/lib/api-types'
import { RaceCard } from '@/components/race-card'

export default function MypagePage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [likedRaces, setLikedRaces] = useState<ApiRaceListItem[]>([])
  const [likedRacesLoading, setLikedRacesLoading] = useState(true)

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.replace('/login')
      return
    }
    setEmail(getUserEmail())
    setReady(true)

    api.getLikedRaces()
      .then(setLikedRaces)
      .catch(() => {})
      .finally(() => setLikedRacesLoading(false))
  }, [router])

  // Gate on the auth check completing, not on `email`. The email entry can be
  // absent (e.g. an app webview that restored only the token) and gating on it
  // would leave a logged-in user staring at a blank screen.
  if (!ready) return null

  const handleDelete = async () => {
    if (deleteConfirm !== '탈퇴') return
    setLoading(true)
    setError(null)
    try {
      await api.deleteAccount()
      router.replace('/')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-navy px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center gap-2">
          <Link href="/" className="text-xl font-extrabold text-amber">런마켓</Link>
          <span className="text-white/50 text-sm">/ 내 계정</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        <h1 className="text-lg font-bold text-gray-900">내 계정</h1>

        {/* Account info */}
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">계정 정보</p>
          </div>
          <div className="divide-y">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">이메일</p>
                <p className="text-sm font-medium text-gray-900 truncate">{email ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <ShieldCheck className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">비밀번호</p>
                <p className="text-sm text-gray-400">••••••••</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Liked races */}
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">좋아요한 대회</p>
          </div>
          {likedRacesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : likedRaces.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-400">좋아요한 대회가 없습니다.</p>
          ) : (
            <div className="p-4 grid grid-cols-1 gap-4">
              {likedRaces.map((race) => (
                <RaceCard key={race.id} race={race} />
              ))}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="rounded-lg border border-red-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-red-100 bg-red-50">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">계정 관리</p>
          </div>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600">회원 탈퇴</p>
              <p className="text-xs text-gray-400">계정과 모든 데이터가 삭제됩니다</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
            <div className="p-5 border-b">
              <h2 className="text-base font-bold text-gray-900">정말 탈퇴하시겠습니까?</h2>
              <p className="mt-1 text-sm text-gray-500">
                계정이 영구적으로 삭제되며 복구할 수 없습니다.
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  계속하려면 아래에 <span className="font-bold text-gray-900">탈퇴</span>를 입력하세요
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="탈퇴"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteDialog(false); setDeleteConfirm(''); setError(null) }}
                  disabled={loading}
                  className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirm !== '탈퇴' || loading}
                  className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-40"
                >
                  {loading ? '처리 중...' : '탈퇴하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
