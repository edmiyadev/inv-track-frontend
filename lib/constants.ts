export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Food & Beverage",
  "Office Supplies",
  "Tools & Equipment",
  "Other",
] as const

export const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
  { value: "viewer", label: "Viewer" },
] as const

export const STOCK_STATUS = {
  "in-stock": { label: "In Stock", color: "success" },
  "low-stock": { label: "Low Stock", color: "warning" },
  "out-of-stock": { label: "Out of Stock", color: "destructive" },
} as const

export const SUPPLIERS = [
  "Global Supplies Inc.",
  "Tech Distributors",
  "Office Essentials Co.",
  "Industrial Partners",
  "Direct Imports Ltd.",
] as const

export const PRODUCT_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "discontinued", label: "Discontinued" },
] as const

export const USER_STATUS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
] as const
