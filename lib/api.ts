import { getAuthToken, clearAuthToken } from './auth'
import type {
  ApiRace,
  ApiRaceListItem,
  RacesListResponse,
  LoginResponse,
  RegisterRaceRequest,
  UpdateRaceRequest,
  ApiError,
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
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthToken()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
      }

      const errorData: ApiError = await response.json().catch(() => ({
        message: 'An error occurred',
      }))
      throw new Error(errorData.message || `HTTP error ${response.status}`)
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

    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Public APIs
  async getRaces(): Promise<RacesListResponse> {
    return this.request<RacesListResponse>('/api/v1/races')
  }

  async getRace(id: string): Promise<ApiRace> {
    return this.request<ApiRace>(`/api/v1/races/${id}`)
  }

  // Admin APIs
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

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
