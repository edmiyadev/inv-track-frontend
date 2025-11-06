export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  status: string
  message: string
  data: {
    access_token: string
    token_type: string
    user: User
  }
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Product Types
export interface Product {
  id: number
  sku: string
  name: string
  description: string | null
  price: string
  stock_quantity: number
  reorder_point: number
  product_category_id: number | null
  supplier_id: number | null
  created_at: string
  updated_at: string
}

export interface ProductsResponse {
  status: string
  message: string
  data: Product[]
}

export interface ProductResponse {
  status: string
  message: string
  data: Product
}

export interface CreateProductData {
  sku: string
  name: string
  description: string | null
  price: string | number
  stock_quantity: number
  reorder_point: number
  product_category_id: number | null
  supplier_id: number | null
}

export interface UpdateProductData {
  sku?: string
  name?: string
  description?: string | null
  price?: string | number
  stock_quantity?: number
  reorder_point?: number
  product_category_id?: number | null
  supplier_id?: number | null
}

