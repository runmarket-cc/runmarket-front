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
import { setAuthToken } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.login(username, password)
      setAuthToken(response.token)
      toast.success('관리자로 로그인되었습니다')
      router.push('/admin')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다'
      setError(message)
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
        <h1 className="mb-1 text-xl font-semibold text-foreground">관리자 로그인</h1>
        <p className="mb-5 text-sm text-muted-foreground">관리자 전용 페이지입니다</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium">
              아이디
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>
      </div>

      <div className="mt-5 text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground hover:underline text-xs">
          ← 일반 로그인으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
