import { apiClient } from './client'
import type {
  RolesResponse,
  RoleResponse,
  CreateRoleData,
  UpdateRoleData,
} from './types'

export const rolesApi = {
  // Obtener todos los roles
  getAll: async (token: string): Promise<RolesResponse> => {
    return apiClient.get<RolesResponse>('/settings/roles', token)
  },

  // Obtener un rol por ID
  getById: async (id: number, token: string): Promise<RoleResponse> => {
    return apiClient.get<RoleResponse>(`/settings/roles/${id}`, token)
  },

  // Crear un nuevo rol
  create: async (data: CreateRoleData, token: string): Promise<RoleResponse> => {
    return apiClient.post<RoleResponse>('/settings/roles', data, token)
  },

  // Actualizar un rol
  update: async (id: number, data: UpdateRoleData, token: string): Promise<RoleResponse> => {
    return apiClient.put<RoleResponse>(`/settings/roles/${id}`, data, token)
  },

  // Eliminar un rol
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/settings/roles/${id}`, token)
  },
}
