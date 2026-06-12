'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, MailCheck } from 'lucide-react'
import { RunmarketLogo } from '@/components/runmarket-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { Turnstile } from '@/components/turnstile'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      return
    }

    if (!turnstileToken) {
      setError('보안 인증을 완료해주세요.')
      return
    }

    setIsLoading(true)
    try {
      await api.requestPasswordReset(email.trim(), turnstileToken)
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : '비밀번호 재설정 요청에 실패했습니다'
      setError(message)
      setTurnstileToken('')
      setTurnstileKey((k) => k + 1)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
        <RunmarketLogo variant="on-light" size="lg" className="mb-5" />

        <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm text-center">
          <MailCheck className="mx-auto mb-4 h-12 w-12 text-status-green" />
          <h2 className="mb-2 text-lg font-semibold text-foreground">이메일을 확인해주세요</h2>
          <p className="mb-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{email}</span>으로
          </p>
          <p className="text-sm text-muted-foreground">
            비밀번호 재설정 메일을 발송했습니다. 메일의 링크를 클릭하여 새 비밀번호를 설정해주세요.
          </p>

          <div className="mt-6 border-t pt-5">
            <Button asChild className="w-full bg-amber text-navy font-semibold hover:bg-amber/90">
              <Link href="/login">로그인 페이지로 이동</Link>
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
        <h1 className="mb-2 text-xl font-semibold text-foreground">비밀번호 재설정</h1>
        <p className="mb-5 text-sm text-muted-foreground">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <Turnstile
            key={turnstileKey}
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
            onError={() => setTurnstileToken('')}
          />

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-amber text-navy font-semibold hover:bg-amber/90"
            disabled={isLoading || !turnstileToken}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                전송 중...
              </>
            ) : (
              '재설정 링크 보내기'
            )}
          </Button>
        </form>
      </div>

      <div className="mt-5 text-sm text-muted-foreground">
        비밀번호가 기억나셨나요?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          로그인
        </Link>
      </div>
    </div>
  )
}
