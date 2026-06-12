'use client'

const ADMIN_TOKEN_KEY = 'runmarket_admin_token'
const USER_TOKEN_KEY = 'runmarket_user_token'
const USER_EMAIL_KEY = 'runmarket_user_email'

// ── Admin ──────────────────────────────────────────────
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return !!getAuthToken()
}

// ── User ───────────────────────────────────────────────
export function getUserToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(USER_TOKEN_KEY)
}

export function setUserSession(token: string, email: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_TOKEN_KEY, token)
  localStorage.setItem(USER_EMAIL_KEY, email)
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_TOKEN_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
}

export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(USER_EMAIL_KEY)
  if (stored) return stored
  // Fallback: derive the email from the JWT when the email entry is missing.
  // This happens in app webviews where the session is restored with only the
  // token, which would otherwise leave the email null.
  const token = getUserToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.email ?? payload.sub ?? null
  } catch {
    return null
  }
}

export function isUserLoggedIn(): boolean {
  const token = getUserToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearUserSession()
      return false
    }
  } catch {
    // JWT 파싱 실패 시 토큰을 신뢰
  }
  return true
}
