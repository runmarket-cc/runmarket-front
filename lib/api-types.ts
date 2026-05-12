export type RegistrationStatus = 'OPEN' | 'UPCOMING' | 'CLOSED'

export interface ApiRaceListItem {
  id: string
  name: string
  courses: string[]
  date: string
  venue: string
  region: string
  organizer: string
  phone: string
  registrationStatus: RegistrationStatus
  likeCount: number
  isLiked: boolean
}

export interface ApiRace extends ApiRaceListItem {
  startTime: string
  venueAddress: string | null
  representative: string
  email: string
  registrationStartDate: string
  registrationEndDate: string
  homepageUrl: string
  lat: number | null
  lng: number | null
  description: string | null
}

export type RacesListResponse = ApiRaceListItem[]

// ── Admin Auth ─────────────────────────────────────────
export interface LoginResponse {
  token: string
}

// ── User Auth ──────────────────────────────────────────
export interface UserLoginResponse {
  accessToken: string
  expiresAt: string
}

export interface UserRegisterResponse {
  message: string
}

// ── Admin Requests ─────────────────────────────────────
export interface RegisterRaceRequest {
  name: string
  region: string
  date: string
  startTime?: string
  venue: string
  venueAddress?: string
  organizer: string
  representative?: string
  phone: string
  email?: string
  registrationStartDate: string
  registrationEndDate: string
  homepageUrl?: string
  description?: string
  courses: string[]
}

export interface UpdateRaceRequest extends RegisterRaceRequest {}

export interface LikeResponse {
  likeCount: number
  isLiked: boolean
}

export interface ApiError {
  detail?: string   // Spring ProblemDetail
  message?: string
  error?: string    // Spring BasicErrorController
}

// ── Air Quality ────────────────────────────────────────
export interface AirQualityDistrict {
  name: string
  pm10: number
  pm25: number
  ozon: number
  cai: number
  caiGrade: string
}

export interface AirQualityResponse {
  districts: AirQualityDistrict[]
  runningAdvice: string
}
