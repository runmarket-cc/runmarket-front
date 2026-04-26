'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-amber">
          런마켓
        </Link>

        <div className="mx-4 flex max-w-xl flex-1 items-center">
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

        <Link
          href={loggedIn ? '/admin' : '/login'}
          className="text-sm text-white/80 transition-colors hover:text-white"
        >
          대회등록
        </Link>
      </div>
    </header>
  )
}
