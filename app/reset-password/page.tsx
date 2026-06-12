'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { RunmarketLogo } from '@/components/runmarket-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) return

    if (!password.trim() || !passwordConfirm.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setIsLoading(true)
    try {
      await api.confirmPasswordReset(token, password)
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : '비밀번호 재설정에 실패했습니다'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
        <RunmarketLogo variant="on-light" size="lg" className="mb-5" />

        <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-8 text-center shadow-sm">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">유효하지 않은 링크</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            비밀번호 재설정 링크가 올바르지 않습니다. 다시 요청해주세요.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline" className="w-full">
              <Link href="/forgot-password">재설정 링크 다시 받기</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
        <RunmarketLogo variant="on-light" size="lg" className="mb-5" />

        <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-status-green" />
          <h2 className="text-lg font-semibold text-foreground">비밀번호 변경 완료</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            새 비밀번호로 로그인해주세요.
          </p>
          <div className="mt-6">
            <Button asChild className="w-full bg-amber text-navy font-semibold hover:bg-amber/90">
              <Link href="/login">로그인하기</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
      <RunmarketLogo variant="on-light" size="lg" className="mb-5" />

      <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-foreground">새 비밀번호 설정</h1>
        <p className="mb-5 text-sm text-muted-foreground">
          사용하실 새 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              새 비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">8자 이상이어야 합니다</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passwordConfirm" className="text-sm font-medium">
              새 비밀번호 확인
            </Label>
            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-amber text-navy font-semibold hover:bg-amber/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                변경 중...
              </>
            ) : (
              '비밀번호 변경'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
