'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { RaceForm } from '@/components/race-form'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { isLoggedIn } from '@/lib/auth'
import type { ApiRace, UpdateRaceRequest } from '@/lib/api-types'

export default function EditRacePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [race, setRace] = useState<ApiRace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
      return
    }

    const fetchRace = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.getRace(id)
        setRace(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : '대회 정보를 불러오는데 실패했습니다'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchRace()
    }
  }, [id, router])

  const handleSubmit = async (data: UpdateRaceRequest) => {
    if (!race) return
    setIsSubmitting(true)
    try {
      await api.updateRace(race.id, data)
      toast.success('대회가 수정되었습니다')
      router.push(`/races/${race.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : '수정에 실패했습니다'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !race) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-[600px] px-4 text-center">
          <p className="mb-4 text-destructive">{error || '대회를 찾을 수 없습니다'}</p>
          <Button asChild variant="outline">
            <Link href="/">목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-[600px] px-4">
        <Link
          href={`/races/${race.id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          돌아가기
        </Link>

        <h1 className="mb-8 text-2xl font-bold text-foreground">대회 수정</h1>

        <RaceForm
          initialData={race}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="수정 완료"
        />
      </div>
    </div>
  )
}
