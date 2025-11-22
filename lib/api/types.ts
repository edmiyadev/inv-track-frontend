// Permission Type (Spatie Laravel Permission)
export interface Permission {
  id: number
  name: string // formato: "resource.action" (ej: "products.create")
  guard_name: string
  created_at: string
  updated_at: string
  pivot?: {
    role_id: number
    permission_id: number
  }
}

// Role Type (Spatie Laravel Permission)
export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  pivot?: {
    model_type: string
    model_id: number
    role_id: number
  }
  permissions: Permission[]
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  roles?: Role[]
}

export interface CreateUserData {
  name: string
  username: string
  email: string
  password?: string
  password_confirmation?: string
  role: string
  status: "active" | "suspended"
}

export interface UpdateUserData {
  name?: string
  username?: string
  email?: string
  password?: string
  password_confirmation?: string
  role?: string
  status?: "active" | "suspended"
}

export interface UsersResponse {
  status: string
  message: string
  data: User[]
}

export interface UserResponse {
  status: string
  message: string
  data: User
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

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  first_page_url?: string
  last_page_url?: string
  next_page_url?: string | null
  prev_page_url?: string | null
  path?: string
  links?: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
}

export interface PaginatedData<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

export interface ProductsResponse {
  status: string
  message: string
  data: PaginatedData<Product>
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

// Product Category Types
export interface ProductCategory {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface ProductCategoriesResponse {
  status: string
  message: string
  data: PaginatedData<ProductCategory>
}

export interface ProductCategoryResponse {
  status: string
  message: string
  data: ProductCategory
}

export interface CreateProductCategoryData {
  name: string
}

export interface UpdateProductCategoryData {
  name?: string
}

// Supplier Types
export interface Supplier {
  id: number
  name: string
  rnc: string | null
  phone_number: string | null
  email: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SuppliersResponse {
  status: string
  message: string
  data: PaginatedData<Supplier>
}

export interface SupplierResponse {
  status: string
  message: string
  data: Supplier
}

export interface CreateSupplierData {
  name: string
  rnc?: string | null
  phone_number?: string | null
  email?: string | null
  address?: string | null
  is_active?: boolean
}

export interface UpdateSupplierData {
  name?: string
  rnc?: string | null
  phone_number?: string | null
  email?: string | null
  address?: string | null
  is_active?: boolean
}
