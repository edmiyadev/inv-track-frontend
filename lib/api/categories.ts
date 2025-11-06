import { apiClient } from './client'
import type {
  ProductCategoriesResponse,
  ProductCategoryResponse,
  CreateProductCategoryData,
  UpdateProductCategoryData,
} from './types'

export const categoriesApi = {
  // Obtener todas las categorías con paginación
  getAll: async (token: string, page: number = 1, perPage: number = 10): Promise<ProductCategoriesResponse> => {
    return apiClient.get<ProductCategoriesResponse>(`/categories?page=${page}&per_page=${perPage}`, token)
  },

  // Obtener una categoría por ID
  getById: async (id: number, token: string): Promise<ProductCategoryResponse> => {
    return apiClient.get<ProductCategoryResponse>(`/categories/${id}`, token)
  },

  // Crear una nueva categoría
  create: async (data: CreateProductCategoryData, token: string): Promise<ProductCategoryResponse> => {
    return apiClient.post<ProductCategoryResponse>('/categories', data, token)
  },

  // Actualizar una categoría
  update: async (id: number, data: UpdateProductCategoryData, token: string): Promise<ProductCategoryResponse> => {
    return apiClient.put<ProductCategoryResponse>(`/categories/${id}`, data, token)
  },

  // Eliminar una categoría
  delete: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/categories/${id}`, token)
  },
}
