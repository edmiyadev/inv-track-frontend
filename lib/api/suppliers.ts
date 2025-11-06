import { apiClient } from './client'
import type {
  SuppliersResponse,
  SupplierResponse,
  CreateSupplierData,
  UpdateSupplierData,
} from './types'

export const suppliersApi = {
  // Obtener todos los proveedores con paginación
  getAll: async (token: string, page: number = 1, perPage: number = 10): Promise<SuppliersResponse> => {
    return apiClient.get<SuppliersResponse>(`/suppliers?page=${page}&per_page=${perPage}`, token)
  },

  // Obtener un proveedor por ID
  getById: async (id: number, token: string): Promise<SupplierResponse> => {
    return apiClient.get<SupplierResponse>(`/suppliers/${id}`, token)
  },

  // Crear un nuevo proveedor
  create: async (data: CreateSupplierData, token: string): Promise<SupplierResponse> => {
    return apiClient.post<SupplierResponse>('/suppliers', data, token)
  },

  // Actualizar un proveedor
  update: async (id: number, data: UpdateSupplierData, token: string): Promise<SupplierResponse> => {
    return apiClient.put<SupplierResponse>(`/suppliers/${id}`, data, token)
  },

  // Eliminar un proveedor
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/suppliers/${id}`, token)
  },
}
