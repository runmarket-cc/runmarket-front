'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('유효하지 않은 인증 링크입니다.')
      return
    }

    api.verifyEmail(token)
      .then((res) => {
        setMessage(res.message)
        setStatus('success')
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : '이메일 인증에 실패했습니다.')
        setStatus('error')
      })
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pb-16 pt-8">
      <Link href="/" className="mb-5 text-2xl font-extrabold tracking-tight text-navy">
        런마켓
      </Link>

      <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-6 py-8 text-center shadow-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">이메일 인증 중...</h2>
            <p className="mt-2 text-sm text-muted-foreground">잠시만 기다려주세요.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-status-green" />
            <h2 className="text-lg font-semibold text-foreground">인증 완료!</h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6">
              <Button asChild className="w-full bg-amber text-navy font-semibold hover:bg-amber/90">
                <Link href="/login">로그인하기</Link>
              </Button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">인증 실패</h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">다시 가입하기</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full text-sm">
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
