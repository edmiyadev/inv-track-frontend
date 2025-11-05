export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  reorderPoint: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  image?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryMovement {
  id: string
  productId: string
  productName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  performedBy: string
  timestamp: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff" | "viewer"
  status: "active" | "suspended"
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}

export interface DashboardStats {
  totalProducts: number
  lowStockItems: number
  totalValue: number
  recentOrders: number
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive"
  paymentTerms: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  orderDate: Date
  expectedDeliveryDate: Date
  status: "draft" | "pending" | "approved" | "received" | "cancelled"
  items: PurchaseOrderItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

export interface GoodsReceipt {
  id: string
  receiptNumber: string
  purchaseOrderId: string
  poNumber: string
  supplierId: string
  supplierName: string
  receivedDate: Date
  receivedBy: string
  items: GoodsReceiptItem[]
  status: "partial" | "complete"
  notes?: string
  createdAt: Date
}

export interface GoodsReceiptItem {
  id: string
  productId: string
  productName: string
  orderedQuantity: number
  receivedQuantity: number
  status: "pending" | "received" | "damaged"
}

export interface PurchaseInvoice {
  id: string
  invoiceNumber: string
  purchaseOrderId: string
  poNumber: string
  supplierId: string
  supplierName: string
  invoiceDate: Date
  dueDate: Date
  status: "outstanding" | "partial" | "paid" | "overdue"
  subtotal: number
  tax: number
  total: number
  paidAmount: number
  balanceAmount: number
  paymentDate?: Date
  notes?: string
  createdAt: Date
}

export interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive"
  creditLimit: number
  paymentTerms: string
  createdAt: Date
  updatedAt: Date
}

export interface SalesOrder {
  id: string
  soNumber: string
  customerId: string
  customerName: string
  orderDate: Date
  expectedDeliveryDate: Date
  status: "draft" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  items: SalesOrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface SalesOrderItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Shipment {
  id: string
  shipmentNumber: string
  salesOrderId: string
  soNumber: string
  customerId: string
  customerName: string
  shippedDate: Date
  deliveredDate?: Date
  carrier: string
  trackingNumber: string
  status: "preparing" | "shipped" | "in-transit" | "delivered"
  items: ShipmentItem[]
  shippedBy: string
  notes?: string
  createdAt: Date
}

export interface ShipmentItem {
  id: string
  productId: string
  productName: string
  orderedQuantity: number
  shippedQuantity: number
}

export interface SalesInvoice {
  id: string
  invoiceNumber: string
  salesOrderId: string
  soNumber: string
  customerId: string
  customerName: string
  invoiceDate: Date
  dueDate: Date
  status: "outstanding" | "partial" | "paid" | "overdue"
  subtotal: number
  tax: number
  discount: number
  total: number
  paidAmount: number
  balanceAmount: number
  paymentDate?: Date
  notes?: string
  createdAt: Date
}
