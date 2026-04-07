import { z } from "zod"

// Product Form Validation Schema
export const productFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name is too long"),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU is too long")
    .regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description is too long").optional(),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price is too high")
    .multipleOf(0.01, "Price must have at most 2 decimal places"),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  reorderPoint: z.coerce
    .number()
    .int("Reorder point must be a whole number")
    .min(0, "Reorder point cannot be negative"),
  supplier: z
    .string()
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name is too long")
    .optional(),
  status: z.enum(["active", "inactive", "discontinued"]).default("active"),
})

export type ProductFormData = z.infer<typeof productFormSchema>

// User Form Validation Schema
export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    // .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    .optional()
    .or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
  roles: z.array(z.number()).min(1, "Debe seleccionar al menos un rol"),
  status: z.enum(["active", "suspended"]).default("active"),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false
  }
  return true
}, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

export type UserFormData = z.infer<typeof userFormSchema>

// Role Form Validation Schema
export const roleFormSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").max(50, "Role name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
  permissions: z.object({
    dashboard: z.object({
      view: z.boolean().default(false),
    }),
    products: z.object({
      view: z.boolean().default(false),
      create: z.boolean().default(false),
      edit: z.boolean().default(false),
      delete: z.boolean().default(false),
      export: z.boolean().default(false),
    }),
    inventory: z.object({
      view: z.boolean().default(false),
      adjust: z.boolean().default(false),
      transfer: z.boolean().default(false),
      viewHistory: z.boolean().default(false),
    }),
    purchasing: z.object({
      viewOrders: z.boolean().default(false),
      createOrders: z.boolean().default(false),
      editOrders: z.boolean().default(false),
      deleteOrders: z.boolean().default(false),
      approveOrders: z.boolean().default(false),
      viewSuppliers: z.boolean().default(false),
      manageSuppliers: z.boolean().default(false),
      viewInvoices: z.boolean().default(false),
      manageInvoices: z.boolean().default(false),
    }),
    sales: z.object({
      viewOrders: z.boolean().default(false),
      createOrders: z.boolean().default(false),
      editOrders: z.boolean().default(false),
      deleteOrders: z.boolean().default(false),
      viewCustomers: z.boolean().default(false),
      manageCustomers: z.boolean().default(false),
      viewInvoices: z.boolean().default(false),
      manageInvoices: z.boolean().default(false),
      manageShipments: z.boolean().default(false),
    }),
    users: z.object({
      view: z.boolean().default(false),
      create: z.boolean().default(false),
      edit: z.boolean().default(false),
      delete: z.boolean().default(false),
      manageRoles: z.boolean().default(false),
    }),
    settings: z.object({
      view: z.boolean().default(false),
      edit: z.boolean().default(false),
    }),
    reports: z.object({
      view: z.boolean().default(false),
      export: z.boolean().default(false),
    }),
  }),
})

export type RoleFormData = z.infer<typeof roleFormSchema>

// Supplier Form Validation Schema
export const supplierFormSchema = z.object({
  name: z.string().min(2, "Supplier name must be at least 2 characters").max(100, "Supplier name is too long"),
  rnc: z.string().max(20, "RNC is too long").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone_number: z.string().max(20, "Phone number is too long").optional().or(z.literal("")),
  address: z.string().max(200, "Address is too long").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
})

export type SupplierFormData = z.infer<typeof supplierFormSchema>

// Purchase Order Form Validation Schema
export const purchaseOrderFormSchema = z.object({
  supplierId: z.coerce.number().min(1, "Please select a supplier"),
  warehouseId: z.coerce.number().optional(),
  orderDate: z.string().min(1, "Please select a date"),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().min(1, "Please select a product"),
        quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
        unitPrice: z.coerce.number().min(0.01, "Unit price must be greater than 0"),
      }),
    )
    .min(1, "Please add at least one item"),
  notes: z.string().max(500, "Notes are too long").optional(),
})

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderFormSchema>

// Goods Receipt Form Validation Schema
export const goodsReceiptFormSchema = z.object({
  purchaseOrderId: z.string().min(1, "Please select a purchase order"),
  receivedDate: z.date(),
  items: z.array(
    z.object({
      productId: z.string(),
      receivedQuantity: z.coerce.number().int().min(0, "Received quantity cannot be negative"),
      status: z.enum(["received", "damaged"]),
    }),
  ),
  notes: z.string().max(500, "Notes are too long").optional(),
})

export type GoodsReceiptFormData = z.infer<typeof goodsReceiptFormSchema>

// Purchase Invoice Form Validation Schema
export const purchaseInvoiceFormSchema = z.object({
  purchaseOrderId: z.string().min(1, "Please select a purchase order"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.date(),
  dueDate: z.date(),
  paidAmount: z.coerce.number().min(0, "Paid amount cannot be negative").optional(),
  paymentDate: z.date().optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
})

export type PurchaseInvoiceFormData = z.infer<typeof purchaseInvoiceFormSchema>

// Customer Form Validation Schema
export const customerFormSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Customer name is too long"),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(20, "Phone number is too long"),
  address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address is too long"),
  creditLimit: z.coerce.number().min(0, "Credit limit cannot be negative"),
  paymentTerms: z.string().min(1, "Please specify payment terms"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type CustomerFormData = z.infer<typeof customerFormSchema>

// Sales Order Form Validation Schema
export const salesOrderFormSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  orderDate: z.date(),
  expectedDeliveryDate: z.date(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Please select a product"),
        quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
        unitPrice: z.coerce.number().min(0.01, "Unit price must be greater than 0"),
      }),
    )
    .min(1, "Please add at least one item"),
  discount: z.coerce.number().min(0, "Discount cannot be negative").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
})

export type SalesOrderFormData = z.infer<typeof salesOrderFormSchema>
