import { getAuthToken, clearAuthToken, getUserToken, clearUserSession } from './auth'
import type {
  ApiRace,
  RacesListResponse,
  LoginResponse,
  UserLoginResponse,
  UserRegisterResponse,
  RegisterRaceRequest,
  UpdateRaceRequest,
} from './api-types'

const API_BASE = 'https://api.runmarket.cc'

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

    const response = await fetch(url, {
      ...options,
      headers,
    })

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
  }

  private async authRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('인증이 필요합니다')
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
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
  }

  // ── Public APIs ────────────────────────────────────────
  async getRaces(): Promise<RacesListResponse> {
    return this.request<RacesListResponse>('/api/v1/races')
  }

  async getRace(id: string): Promise<ApiRace> {
    return this.request<ApiRace>(`/api/v1/races/${id}`)
  }

  // ── User Auth ──────────────────────────────────────────
  async userLogin(email: string, password: string): Promise<UserLoginResponse> {
    return this.request<UserLoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async userRegister(email: string, password: string): Promise<UserRegisterResponse> {
    return this.request<UserRegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async verifyEmail(token: string): Promise<UserRegisterResponse> {
    return this.request<UserRegisterResponse>('/api/v1/auth/verify', {
      method: 'PATCH',
      body: JSON.stringify({ token }),
    })
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
