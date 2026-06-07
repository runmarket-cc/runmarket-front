'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { setUserSession } from '@/lib/auth'
import { Turnstile } from '@/components/turnstile'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    if (!turnstileToken) {
      setError('보안 인증을 완료해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.userLogin(email.trim(), password, turnstileToken)
      setUserSession(response.accessToken, email.trim(), response.expiresAt)
      toast.success('로그인되었습니다')
      router.push('/')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다'
      setError(message)
      setTurnstileToken('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
      <Link href="/" className="mb-5 text-2xl font-extrabold tracking-tight text-navy">
        런마켓
      </Link>

      <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-6 shadow-sm">
        <h1 className="mb-5 text-xl font-semibold text-foreground">로그인</h1>

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
              autoComplete="current-password"
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
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          계속함으로써{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">이용약관</span>
          {' '}및{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">개인정보처리방침</span>
          에 동의합니다.
        </p>
      </div>

      <div className="relative my-5 w-full max-w-sm">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-100 px-3 text-xs text-muted-foreground">
            런마켓이 처음이신가요?
          </span>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <Button
          asChild
          variant="outline"
          className="w-full border-gray-400 text-sm font-medium hover:bg-gray-50"
        >
          <Link href="/signup">새 계정 만들기</Link>
        </Button>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-5 text-center">
        <Link
          href="/admin/login"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          관리자 로그인
        </Link>
      </div>
    </div>
  )
}
