import { apiClient } from './client'
import type { PermissionsResponse } from './types'

export const permissionsApi = {
  // Obtener todos los permisos
  getAll: async (token: string): Promise<PermissionsResponse> => {
    return apiClient.get<PermissionsResponse>('/settings/permissions', token)
  },
}
