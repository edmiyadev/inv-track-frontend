import { useAuthStore } from '@/lib/store/auth'
import { apiClient } from './client'

export async function authenticatedRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data?: unknown
): Promise<T> {
  const { accessToken, refreshAuth } = useAuthStore.getState()

  if (!accessToken) {
    throw new Error('No access token available')
  }

  try {
    return await apiClient[method]<T>(endpoint, data as any, accessToken)
  } catch (error: any) {
    if (error.message?.includes('401') || error.message?.includes('expired')) {
      try {
        await refreshAuth()
        const { accessToken: newToken } = useAuthStore.getState()
        if (!newToken) {
          throw new Error('Failed to refresh token')
        }
        return await apiClient[method]<T>(endpoint, data as any, newToken)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        throw new Error('Session expired. Please login again.')
      }
    }
    throw error
  }
}

export const authFetch = {
  get: <T>(endpoint: string) => authenticatedRequest<T>('get', endpoint),
  post: <T>(endpoint: string, data?: unknown) =>
    authenticatedRequest<T>('post', endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    authenticatedRequest<T>('put', endpoint, data),
  delete: <T>(endpoint: string) => authenticatedRequest<T>('delete', endpoint),
  patch: <T>(endpoint: string, data?: unknown) =>
    authenticatedRequest<T>('patch', endpoint, data),
}
