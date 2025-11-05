export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'manager' | 'staff' | 'viewer'
  firstName?: string
  lastName?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RefreshTokenResponse {
  access_token: string
  token_type: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
