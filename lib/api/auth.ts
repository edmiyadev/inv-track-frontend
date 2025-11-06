import { apiClient } from './client'
import type {
  LoginCredentials,
  LoginResponse,
  User,
} from './types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials)
  },

  logout: async (token: string): Promise<void> => {
    return apiClient.post('/auth/logout', {}, token)
  },

  getProfile: async (token: string): Promise<User> => {
    return apiClient.get<User>('/api/user', token)
  },

  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await authApi.getProfile(token)
      return true
    } catch {
      return false
    }
  },
}
