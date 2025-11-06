import { apiClient } from './client'
import type {
  ProductsResponse,
  ProductResponse,
  CreateProductData,
  UpdateProductData,
} from './types'

export const productsApi = {
  // Obtener todos los productos
  getAll: async (token: string): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>('/products', token)
  },

  // Obtener un producto por ID
  getById: async (id: number, token: string): Promise<ProductResponse> => {
    return apiClient.get<ProductResponse>(`/products/${id}`, token)
  },

  // Crear un nuevo producto
  create: async (data: CreateProductData, token: string): Promise<ProductResponse> => {
    return apiClient.post<ProductResponse>('/products', data, token)
  },

  // Actualizar un producto
  update: async (id: number, data: UpdateProductData, token: string): Promise<ProductResponse> => {
    return apiClient.put<ProductResponse>(`/products/${id}`, data, token)
  },

  // Eliminar un producto
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`, token)
  },
}
