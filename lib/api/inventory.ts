import { apiClient } from './client'
import type {
  StockResponse,
  LowStockResponse,
  UpdateReorderPointData,
  MovementsResponse,
  MovementResponse,
  CreateMovementData,
} from './types'

export const inventoryApi = {
  // Stocks
  getAllStocks: async (token: string, filters?: { product_id?: number; warehouse_id?: number }): Promise<StockResponse> => {
    const params = new URLSearchParams()
    if (filters?.product_id) params.append('product_id', filters.product_id.toString())
    if (filters?.warehouse_id) params.append('warehouse_id', filters.warehouse_id.toString())
    
    return apiClient.get<StockResponse>(`/inventory/stocks?${params.toString()}`, token)
  },

  getWarehouseStock: async (warehouseId: number, token: string): Promise<StockResponse> => {
    return apiClient.get<StockResponse>(`/inventory/stocks/warehouse/${warehouseId}`, token)
  },

  getLowStock: async (token: string, warehouseId?: number): Promise<LowStockResponse> => {
    const params = new URLSearchParams()
    if (warehouseId) params.append('warehouse_id', warehouseId.toString())
    
    return apiClient.get<LowStockResponse>(`/inventory/stocks/low-stock?${params.toString()}`, token)
  },

  updateReorderPoint: async (data: UpdateReorderPointData, token: string): Promise<any> => {
    return apiClient.put('/inventory/stocks/reorder-point', data, token)
  },

  // Movements
  getAllMovements: async (token: string, page: number = 1, perPage: number = 10): Promise<MovementsResponse> => {
    return apiClient.get<MovementsResponse>(`/inventory/movements?page=${page}&per_page=${perPage}`, token)
  },

  getMovementById: async (id: number, token: string): Promise<MovementResponse> => {
    return apiClient.get<MovementResponse>(`/inventory/movements/${id}`, token)
  },

  createMovement: async (data: CreateMovementData, token: string): Promise<MovementResponse> => {
    return apiClient.post<MovementResponse>('/inventory/movements', data, token)
  },
}
