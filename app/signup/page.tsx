'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { Turnstile } from '@/components/turnstile'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
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

    if (!turnstileToken) {
      setError('보안 인증을 완료해주세요.')
      return
    }

    setIsLoading(true)
    try {
      await api.userRegister(email.trim(), password, turnstileToken)
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다'
      setError(message)
      setTurnstileToken('')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
        <Link href="/" className="mb-5 text-2xl font-extrabold tracking-tight text-navy">
          런마켓
        </Link>

        <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm text-center">
          <MailCheck className="mx-auto mb-4 h-12 w-12 text-status-green" />
          <h2 className="mb-2 text-lg font-semibold text-foreground">이메일을 확인해주세요</h2>
          <p className="mb-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{email}</span>으로
          </p>
          <p className="text-sm text-muted-foreground">
            인증 메일을 발송했습니다. 메일의 링크를 클릭하면 가입이 완료됩니다.
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
      <Link href="/" className="mb-5 text-2xl font-extrabold tracking-tight text-navy">
        런마켓
      </Link>

      <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-6 shadow-sm">
        <h1 className="mb-5 text-xl font-semibold text-foreground">계정 만들기</h1>

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

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">8자 이상이어야 합니다</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passwordConfirm" className="text-sm font-medium">
              비밀번호 확인
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

          <Turnstile
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
                처리 중...
              </>
            ) : (
              '계정 만들기'
            )}
          </Button>
        </form>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          계정을 만들면{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">이용약관</span>
          {' '}및{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">개인정보처리방침</span>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>

      <div className="mt-5 text-sm text-muted-foreground">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          로그인
        </Link>
      </div>
    </div>
  )
}
