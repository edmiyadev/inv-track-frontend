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

export interface CreateRoleData {
  name: string
  permissions: string[]
}

export interface UpdateRoleData {
  name?: string
  permissions?: string[]
}

export interface RolesResponse {
  status: string
  message: string
  data: Role[]
}

export interface RoleResponse {
  status: string
  message: string
  data: Role
}

export interface PermissionsResponse {
  status: string
  message: string
  data: Permission[]
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
  roles: number[]
  status: "active" | "suspended"
}

export interface UpdateUserData {
  name?: string
  username?: string
  email?: string
  password?: string
  password_confirmation?: string
  roles?: number[]
  status?: "active" | "suspended"
}

export interface UsersResponse {
  status: string
  message: string
  data: PaginatedData<User>
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

// Warehouse Types
export interface Warehouse {
  id: number
  name: string
  code: string
  description: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface WarehousesResponse {
  status: string
  message: string
  data: PaginatedData<Warehouse>
}

export interface WarehouseResponse {
  status: string
  message: string
  data: Warehouse
}

export interface CreateWarehouseData {
  name: string
  code: string
  description?: string | null
  location?: string | null
}

export interface UpdateWarehouseData {
  name?: string
  code?: string
  description?: string | null
  location?: string | null
}

// Inventory Types
export interface Stock {
  id: number
  product_id: number
  warehouse_id: number
  quantity: number
  reorder_point: number
  last_restock_date: string | null
  created_at: string
  updated_at: string
  product?: Product
  warehouse?: Warehouse
  status?: 'ok' | 'low'
}

export interface StockResponse {
  status: string
  message: string
  data: Stock[]
}

export interface LowStockResponse {
  status: string
  message: string
  data: Stock[]
}

export interface UpdateReorderPointData {
  warehouse_id: number
  product_id: number
  reorder_point: number
}

// Inventory Movement Types
export type MovementType = 'in' | 'out' | 'transfer' | 'adjustment'

export interface MovementItem {
  id: number
  inventory_movement_id: number
  product_id: number
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Movement {
  id: number
  movement_type: MovementType
  origin_warehouse_id: number | null
  destination_warehouse_id: number | null
  notes: string | null
  user_id: number
  created_at: string
  updated_at: string
  origin_warehouse?: Warehouse
  destination_warehouse?: Warehouse
  items?: MovementItem[]
  user?: User
}

export interface MovementsResponse {
  status: string
  message: string
  data: PaginatedData<Movement>
}

export interface MovementResponse {
  status: string
  message: string
  data: Movement
}

export interface CreateMovementItemData {
  product_id: number
  quantity: number
  unit_price?: number
}

export interface CreateMovementData {
  movement_type: MovementType
  origin_warehouse_id?: number | null
  destination_warehouse_id?: number | null
  notes?: string
  items: CreateMovementItemData[]
}

// Purchase Types
export type PurchaseStatus = 'pending' | 'completed' | 'canceled'

export interface PurchaseItem {
  id: number
  purchase_id: number
  product_id: number
  quantity: number
  unit_price: string
  total_price: string
  created_at: string
  updated_at: string
  product?: Product
}

export interface Purchase {
  id: number
  supplier_id: number
  warehouse_id: number | null
  status: PurchaseStatus
  total_amount: string
  purchase_date: string
  notes: string | null
  created_at: string
  updated_at: string
  supplier?: Supplier
  warehouse?: Warehouse
  items?: PurchaseItem[]
}

export interface PurchasesResponse {
  status: string
  message: string
  data: PaginatedData<Purchase>
}

export interface PurchaseResponse {
  status: string
  message: string
  data: Purchase
}

export interface CreatePurchaseItemData {
  product_id: number
  quantity: number
  unit_price: number
}

export interface CreatePurchaseData {
  supplier_id: number
  warehouse_id?: number | null
  notes?: string | null
  items: CreatePurchaseItemData[]
}

export interface UpdatePurchaseData {
  status?: PurchaseStatus
  notes?: string | null
  items?: CreatePurchaseItemData[]
}

// Tax Types
export interface Tax {
  id: number
  name: string
  percentage: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TaxesResponse {
  status: string
  message: string
  data: PaginatedData<Tax>
}

export interface TaxResponse {
  status: string
  message: string
  data: Tax
}

export interface CreateTaxData {
  name: string
  percentage: number
  description?: string | null
  is_active?: boolean
}

export interface UpdateTaxData {
  name?: string
  percentage?: number
  description?: string | null
  is_active?: boolean
}
