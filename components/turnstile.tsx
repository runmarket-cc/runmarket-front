'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileRenderOptions {
  sitekey: string
  theme?: 'auto' | 'light' | 'dark'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'auto' | 'light' | 'dark'
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'

export function Turnstile({ onVerify, onExpire, onError, theme = 'auto' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const render = () => {
      if (!containerRef.current) return
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current)
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
      })
    }

    const SCRIPT_ID = 'cf-turnstile-script'
    const existing = document.getElementById(SCRIPT_ID)

    if (existing) {
      if (window.turnstile) {
        render()
      } else {
        existing.addEventListener('load', render, { once: true })
      }
    } else {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.defer = true
      script.addEventListener('load', render, { once: true })
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  return <div ref={containerRef} />
}
