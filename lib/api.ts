import { getAuthToken, clearAuthToken, getUserToken, clearUserSession } from './auth'
import type {
  ApiRace,
  RacesListResponse,
  LoginResponse,
  UserLoginResponse,
  UserRegisterResponse,
  PasswordResetResponse,
  RegisterRaceRequest,
  UpdateRaceRequest,
  LikeResponse,
  LegalDocument,
  RunListResponse,
  RunDetail,
} from './api-types'

const API_BASE = 'https://api.runmarket.cc'
const REQUEST_TIMEOUT_MS = 15_000

function withTimeout(signal?: AbortSignal): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  return { signal: controller.signal, clear: () => clearTimeout(timeoutId) }
}

function handleAbort(err: unknown): never {
  if (err instanceof Error && err.name === 'AbortError') {
    throw new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.')
  }
  throw err
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    }

    const { signal, clear } = withTimeout(options.signal as AbortSignal | undefined)
    try {
      const response = await fetch(url, { ...options, headers, signal })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        // ProblemDetail format (Spring): { detail: "..." }
        // BasicErrorController format: { error: "..." }
        // Legacy format: { message: "..." }
        const message =
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          `HTTP error ${response.status}`
        throw new Error(message)
      }

      if (response.status === 204) {
        return undefined as T
      }

      return response.json()
    } catch (err) {
      handleAbort(err)
    } finally {
      clear()
    }
  }

  private async userAuthRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getUserToken()
    if (!token) {
      throw new Error('인증이 필요합니다')
    }

    const { signal, clear } = withTimeout(options.signal as AbortSignal | undefined)
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
        signal,
      })

      if (!response.ok) {
        if (response.status === 401) {
          clearUserSession()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }

        const errorData = await response.json().catch(() => null)
        const message =
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          `HTTP error ${response.status}`
        throw new Error(message)
      }

      if (response.status === 204) return undefined as T
      return response.json()
    } catch (err) {
      handleAbort(err)
    } finally {
      clear()
    }
  }

  private async authRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('인증이 필요합니다')
    }

    const { signal, clear } = withTimeout(options.signal as AbortSignal | undefined)
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
        signal,
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearAuthToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login'
          }
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }

        const errorData = await response.json().catch(() => null)
        const message =
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          `HTTP error ${response.status}`
        throw new Error(message)
      }

      if (response.status === 204) return undefined as T
      return response.json()
    } catch (err) {
      handleAbort(err)
    } finally {
      clear()
    }
  }

  // ── Public APIs ────────────────────────────────────────
  async getRaces(): Promise<RacesListResponse> {
    const token = getUserToken()
    return this.request<RacesListResponse>('/api/v1/races', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  async getRace(id: string): Promise<ApiRace> {
    const token = getUserToken()
    return this.request<ApiRace>(`/api/v1/races/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  // ── Legal documents ────────────────────────────────────
  async getTerms(): Promise<LegalDocument> {
    return this.request<LegalDocument>('/api/v1/contents/terms')
  }

  async getPrivacy(): Promise<LegalDocument> {
    return this.request<LegalDocument>('/api/v1/contents/privacy')
  }

  // ── User Auth ──────────────────────────────────────────
  async userLogin(email: string, password: string, turnstileToken: string): Promise<UserLoginResponse> {
    return this.request<UserLoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, turnstileToken }),
    })
  }

  async userRegister(email: string, password: string, turnstileToken: string): Promise<UserRegisterResponse> {
    return this.request<UserRegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, turnstileToken }),
    })
  }

  async verifyEmail(token: string): Promise<UserRegisterResponse> {
    return this.request<UserRegisterResponse>('/api/v1/auth/verify', {
      method: 'PATCH',
      body: JSON.stringify({ token }),
    })
  }

  async requestPasswordReset(email: string, turnstileToken: string): Promise<PasswordResetResponse> {
    return this.request<PasswordResetResponse>('/api/v1/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email, turnstileToken }),
    })
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<PasswordResetResponse> {
    return this.request<PasswordResetResponse>('/api/v1/auth/password-reset', {
      method: 'PATCH',
      body: JSON.stringify({ token, newPassword }),
    })
  }

  async likeRace(id: string): Promise<LikeResponse> {
    return this.userAuthRequest<LikeResponse>(`/api/v1/races/${id}/like`, { method: 'POST' })
  }

  async unlikeRace(id: string): Promise<LikeResponse> {
    return this.userAuthRequest<LikeResponse>(`/api/v1/races/${id}/like`, { method: 'DELETE' })
  }

  async getLikedRaces(): Promise<RacesListResponse> {
    return this.userAuthRequest<RacesListResponse>('/api/v1/users/me/liked-races')
  }

  // ── Running records ────────────────────────────────────
  async getUserRuns(): Promise<RunListResponse> {
    return this.userAuthRequest<RunListResponse>('/api/v1/users/me/runs')
  }

  async getUserRun(id: string): Promise<RunDetail> {
    return this.userAuthRequest<RunDetail>(`/api/v1/users/me/runs/${id}`)
  }

  async deleteAccount(): Promise<void> {
    const token = getUserToken()
    if (!token) throw new Error('인증이 필요합니다')

    const response = await fetch(`${API_BASE}/api/v1/users/me`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        `HTTP error ${response.status}`
      throw new Error(message)
    }

    clearUserSession()
  }

  // ── Admin Auth ─────────────────────────────────────────
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  // ── Admin Race APIs ────────────────────────────────────
  async registerRace(data: RegisterRaceRequest): Promise<ApiRace> {
    return this.authRequest<ApiRace>('/admin/races/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRace(id: string, data: UpdateRaceRequest): Promise<ApiRace> {
    return this.authRequest<ApiRace>(`/admin/races/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRace(id: string): Promise<void> {
    return this.authRequest<void>(`/admin/races/${id}`, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiClient()
