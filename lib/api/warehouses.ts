import { apiClient } from './client'
import type {
  WarehousesResponse,
  WarehouseResponse,
  CreateWarehouseData,
  UpdateWarehouseData,
} from './types'

export const warehousesApi = {
  // Obtener todos los almacenes con paginación
  getAll: async (token: string, page: number = 1, perPage: number = 10): Promise<WarehousesResponse> => {
    return apiClient.get<WarehousesResponse>(`/warehouses?page=${page}&per_page=${perPage}`, token)
  },

  // Obtener un almacén por ID
  getById: async (id: number, token: string): Promise<WarehouseResponse> => {
    return apiClient.get<WarehouseResponse>(`/warehouses/${id}`, token)
  },

  // Crear un nuevo almacén
  create: async (data: CreateWarehouseData, token: string): Promise<WarehouseResponse> => {
    return apiClient.post<WarehouseResponse>('/warehouses', data, token)
  },

  // Actualizar un almacén
  update: async (id: number, data: UpdateWarehouseData, token: string): Promise<WarehouseResponse> => {
    return apiClient.put<WarehouseResponse>(`/warehouses/${id}`, data, token)
  },

  // Eliminar un almacén
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/warehouses/${id}`, token)
  },
}
