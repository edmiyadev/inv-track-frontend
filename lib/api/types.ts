export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  status: string
  message: string
  data: {
    access_token: string
    token_type: string
    user: User
  }
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
