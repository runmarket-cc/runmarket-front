'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Pencil, Trash2, MapPin, Calendar, Clock, Phone, Mail, Globe, Building2, User } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { api } from '@/lib/api'
import { isLoggedIn } from '@/lib/auth'
import type { ApiRace } from '@/lib/api-types'
import { distancePillColors } from '@/lib/data'

const statusLabels: Record<string, string> = {
  OPEN: '접수중',
  UPCOMING: '접수예정',
  CLOSED: '접수마감',
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-status-green text-white',
  UPCOMING: 'bg-status-amber text-white',
  CLOSED: 'bg-status-gray text-white',
}

export default function RaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [race, setRace] = useState<ApiRace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsAdmin(isLoggedIn())
  }, [])

  useEffect(() => {
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
  }, [id])

  const handleDelete = async () => {
    if (!race) return
    setIsDeleting(true)
    try {
      await api.deleteRace(race.id)
      toast.success('대회가 삭제되었습니다')
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : '삭제에 실패했습니다'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
        <div className="mx-auto max-w-[720px] px-4 text-center">
          <p className="mb-4 text-destructive">{error || '대회를 찾을 수 없습니다'}</p>
          <Button asChild variant="outline">
            <Link href="/">목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[720px] px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="flex-1 text-balance text-2xl font-bold text-foreground">{race.name}</h1>
            {isAdmin && (
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/edit/${race.id}`}>
                    <Pencil className="mr-1.5 h-4 w-4" />
                    수정
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                      {isDeleting ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-1.5 h-4 w-4" />
                      )}
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>대회를 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다. 대회 정보가 영구적으로 삭제됩니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={cn('border-0', statusColors[race.registrationStatus])}>
              {statusLabels[race.registrationStatus]}
            </Badge>
            {race.courses.map((course) => (
              <span
                key={course}
                className={cn(
                  'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                  distancePillColors[course] || 'bg-gray-400 text-white'
                )}
              >
                {course}
              </span>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                대회 날짜
              </span>
              <span className="font-medium">
                {formatDate(race.date)}
                {race.startTime && <span className="ml-1 text-muted-foreground">({race.startTime})</span>}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                접수 기간
              </span>
              <span className="font-medium">
                {formatDate(race.registrationStartDate)} ~ {formatDate(race.registrationEndDate)}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                장소
              </span>
              <div className="text-right">
                <p className="font-medium">{race.venue}</p>
                {race.venueAddress && (
                  <p className="text-sm text-muted-foreground">{race.venueAddress}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                주최
              </span>
              <span className="font-medium">{race.organizer}</span>
            </div>

            {race.representative && (
              <div className="flex justify-between border-b pb-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  대표자
                </span>
                <span className="font-medium">{race.representative}</span>
              </div>
            )}

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                연락처
              </span>
              <a href={`tel:${race.phone}`} className="font-medium hover:underline">
                {race.phone}
              </a>
            </div>

            {race.email && (
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  이메일
                </span>
                <a href={`mailto:${race.email}`} className="font-medium hover:underline">
                  {race.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Description section */}
        {race.description && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">대회 소개</h2>
            <p className="leading-relaxed text-muted-foreground">{race.description}</p>
          </div>
        )}

        {/* CTA button */}
        {race.homepageUrl ? (
          <Button asChild className="w-full bg-amber text-foreground hover:bg-amber/90">
            <a href={race.homepageUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              공식 홈페이지에서 신청하기
            </a>
          </Button>
        ) : (
          <Button className="w-full bg-amber text-foreground" disabled>
            공식 홈페이지에서 신청하기
          </Button>
        )}
      </main>
    </div>
  )
}
