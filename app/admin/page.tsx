'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { RaceForm } from '@/components/race-form'
import { api } from '@/lib/api'
import { isLoggedIn } from '@/lib/auth'
import type { RegisterRaceRequest } from '@/lib/api-types'

export default function AdminPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  const handleSubmit = async (data: RegisterRaceRequest) => {
    setIsSubmitting(true)
    try {
      const race = await api.registerRace(data)
      toast.success('대회가 등록되었습니다')
      router.push(`/races/${race.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : '등록에 실패했습니다'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-[600px] px-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          목록으로
        </Link>

        <h1 className="mb-8 text-2xl font-bold text-foreground">대회 등록</h1>

        <RaceForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="대회 등록"
        />
      </div>
    </div>
  )
}
