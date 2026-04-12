import { apiClient } from './client'
import type {
  SalesResponse,
  SaleResponse,
  CreateSaleData,
  UpdateSaleData,
  SaleStatus,
} from './types'

export const salesApi = {
  getAllSales: async (token: string, page: number = 1, perPage: number = 10, status?: string): Promise<SalesResponse> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    if (status) params.append('status', status)

    return apiClient.get<SalesResponse>(`/sales?${params.toString()}`, token)
  },

  getSaleById: async (id: number, token: string): Promise<SaleResponse> => {
    return apiClient.get<SaleResponse>(`/sales/${id}`, token)
  },

  createSale: async (data: CreateSaleData, token: string): Promise<SaleResponse> => {
    return apiClient.post<SaleResponse>('/sales', data, token)
  },

  updateSale: async (id: number, data: UpdateSaleData, token: string): Promise<SaleResponse> => {
    return apiClient.put<SaleResponse>(`/sales/${id}`, data, token)
  },

  updateSaleStatus: async (id: number, status: SaleStatus, token: string): Promise<SaleResponse> => {
    return apiClient.patch<SaleResponse>(`/sales/${id}/status`, { status }, token)
  },

  deleteSale: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/sales/${id}`, token)
  },
}
