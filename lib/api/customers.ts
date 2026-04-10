import { apiClient } from './client'
import type {
  CustomersResponse,
  CustomerResponse,
  CreateCustomerData,
  UpdateCustomerData,
} from './types'

export const customersApi = {
  // Obtener todos los clientes con paginación
  getAll: async (token: string, page: number = 1, perPage: number = 10): Promise<CustomersResponse> => {
    return apiClient.get<CustomersResponse>(`/customers?page=${page}&per_page=${perPage}`, token)
  },

  // Obtener un cliente por ID
  getById: async (id: number, token: string): Promise<CustomerResponse> => {
    return apiClient.get<CustomerResponse>(`/customers/${id}`, token)
  },

  // Crear un nuevo cliente
  create: async (data: CreateCustomerData, token: string): Promise<CustomerResponse> => {
    return apiClient.post<CustomerResponse>('/customers', data, token)
  },

  // Actualizar un cliente
  update: async (id: number, data: UpdateCustomerData, token: string): Promise<CustomerResponse> => {
    return apiClient.put<CustomerResponse>(`/customers/${id}`, data, token)
  },

  // Eliminar un cliente
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/customers/${id}`, token)
  },
}
