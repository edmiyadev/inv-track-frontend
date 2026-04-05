import { apiClient } from './client'
import type {
  TaxesResponse,
  TaxResponse,
  CreateTaxData,
  UpdateTaxData,
} from './types'

export const taxesApi = {
  // Obtener todos los impuestos con paginación
  getAll: async (token: string, page: number = 1, perPage: number = 10): Promise<TaxesResponse> => {
    return apiClient.get<TaxesResponse>(`/taxes?page=${page}&per_page=${perPage}`, token)
  },

  // Obtener un impuesto por ID
  getById: async (id: number, token: string): Promise<TaxResponse> => {
    return apiClient.get<TaxResponse>(`/taxes/${id}`, token)
  },

  // Crear un nuevo impuesto
  create: async (data: CreateTaxData, token: string): Promise<TaxResponse> => {
    return apiClient.post<TaxResponse>('/taxes', data, token)
  },

  // Actualizar un impuesto
  update: async (id: number, data: UpdateTaxData, token: string): Promise<TaxResponse> => {
    return apiClient.put<TaxResponse>(`/taxes/${id}`, data, token)
  },

  // Eliminar un impuesto
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/taxes/${id}`, token)
  },
}
