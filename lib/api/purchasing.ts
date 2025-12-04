import { apiClient } from './client'
import type {
  SuppliersResponse,
  SupplierResponse,
  CreateSupplierData,
  UpdateSupplierData,
  PurchasesResponse,
  PurchaseResponse,
  CreatePurchaseData,
  UpdatePurchaseData,
} from './types'

export const purchasingApi = {
  // Suppliers
  getAllSuppliers: async (token: string, page: number = 1, perPage: number = 10, search: string = ''): Promise<SuppliersResponse> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    if (search) params.append('search', search)
    
    return apiClient.get<SuppliersResponse>(`/suppliers?${params.toString()}`, token)
  },

  getSupplierById: async (id: number, token: string): Promise<SupplierResponse> => {
    return apiClient.get<SupplierResponse>(`/suppliers/${id}`, token)
  },

  createSupplier: async (data: CreateSupplierData, token: string): Promise<SupplierResponse> => {
    return apiClient.post<SupplierResponse>('/suppliers', data, token)
  },

  updateSupplier: async (id: number, data: UpdateSupplierData, token: string): Promise<SupplierResponse> => {
    return apiClient.put<SupplierResponse>(`/suppliers/${id}`, data, token)
  },

  deleteSupplier: async (id: number, token: string): Promise<void> => {
    return apiClient.delete(`/suppliers/${id}`, token)
  },

  // Purchases
  getAllPurchases: async (token: string, page: number = 1, perPage: number = 10, status?: string): Promise<PurchasesResponse> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    if (status) params.append('status', status)

    return apiClient.get<PurchasesResponse>(`/purchases?${params.toString()}`, token)
  },

  getPurchaseById: async (id: number, token: string): Promise<PurchaseResponse> => {
    return apiClient.get<PurchaseResponse>(`/purchases/${id}`, token)
  },

  createPurchase: async (data: CreatePurchaseData, token: string): Promise<PurchaseResponse> => {
    return apiClient.post<PurchaseResponse>('/purchases', data, token)
  },

  updatePurchase: async (id: number, data: UpdatePurchaseData, token: string): Promise<PurchaseResponse> => {
    return apiClient.put<PurchaseResponse>(`/purchases/${id}`, data, token)
  },
}
