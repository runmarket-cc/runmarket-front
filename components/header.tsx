'use client'

import { useEffect, useState, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isLoggedIn, isUserLoggedIn, getUserEmail, clearUserSession } from '@/lib/auth'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsAdmin(isLoggedIn())
    setUserLoggedIn(isUserLoggedIn())
    setUserEmail(getUserEmail())
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearUserSession()
    setUserLoggedIn(false)
    setUserEmail(null)
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  // 이메일에서 @ 앞부분만 표시
  const displayName = userEmail ? userEmail.split('@')[0] : null

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-xl font-extrabold text-amber">
          런마켓
        </Link>

        {/* Search */}
        <div className="flex min-w-0 flex-1 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="대회명, 지역으로 검색"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-full rounded-md border-0 bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>

        {/* Account dropdown */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex flex-col items-start rounded px-1.5 py-1 text-left transition-colors hover:ring-1 hover:ring-white/40"
          >
            <span className="text-[11px] text-white/70">
              {userLoggedIn ? `안녕하세요, ${displayName}님` : '안녕하세요, 로그인하세요'}
            </span>
            <span className="flex items-center gap-0.5 text-sm font-bold text-white">
              내 계정
              <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
              {userLoggedIn ? (
                <>
                  <div className="border-b bg-gray-50 px-4 py-3">
                    <p className="truncate text-xs font-medium text-foreground">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">로그인됨</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3">
                    <Link
                      href="/login"
                      className="block w-full rounded-md bg-amber py-1.5 text-center text-sm font-semibold text-navy transition-colors hover:bg-amber/90"
                      onClick={() => setDropdownOpen(false)}
                    >
                      로그인
                    </Link>
                  </div>
                  <div className="border-t px-4 py-3 text-xs text-muted-foreground">
                    처음 방문하셨나요?{' '}
                    <Link
                      href="/signup"
                      className="font-medium text-blue-600 hover:underline"
                      onClick={() => setDropdownOpen(false)}
                    >
                      회원가입
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Admin link */}
        {isAdmin && (
          <Link
            href="/admin"
            className="shrink-0 text-sm text-white/80 transition-colors hover:text-white"
          >
            대회등록
          </Link>
        )}
      </div>
    </header>
  )
}
