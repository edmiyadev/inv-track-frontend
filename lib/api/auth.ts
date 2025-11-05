import { apiClient } from './client'
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from './types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials)
  },

  logout: async (token: string): Promise<void> => {
    return apiClient.post('/auth/logout', {}, token)
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
  },

  getProfile: async (token: string): Promise<User> => {
    return apiClient.get<User>('/auth/me', token)
  },

  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await apiClient.post('/auth/verify', { token }, token)
      return true
    } catch {
      return false
    }
  },
}
