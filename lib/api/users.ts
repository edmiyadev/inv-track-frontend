import { apiClient } from './client'
import type {
  UsersResponse,
  UserResponse,
  CreateUserData,
  UpdateUserData,
} from './types'

export const usersApi = {
  // Obtener todos los usuarios con paginación
  getAll: async (token: string, page: number = 1, perPage: number = 10): Promise<UsersResponse> => {
    return apiClient.get<UsersResponse>(`/settings/users?page=${page}&per_page=${perPage}`, token)
  },

  // Obtener un usuario por ID
  getById: async (id: number, token: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/settings/users/${id}`, token)
  },

  // Crear un nuevo usuario
  create: async (data: CreateUserData, token: string): Promise<UserResponse> => {
    return apiClient.post<UserResponse>('/settings/users', data, token)
  },

  // Actualizar un usuario
  update: async (id: number, data: UpdateUserData, token: string): Promise<UserResponse> => {
    return apiClient.put<UserResponse>(`/settings/users/${id}`, data, token)
  },

  // Eliminar un usuario
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/settings/users/${id}`, token)
  },

  // Actualizar roles de un usuario
  updateRoles: async (id: number, roles: string[], token: string): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/settings/users/${id}/roles`, { roles }, token)
  },
}
