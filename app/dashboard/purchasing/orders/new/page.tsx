"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { PurchaseOrderForm } from "@/components/purchasing/purchase-order-form"
import type { PurchaseOrderFormData } from "@/lib/validations"
import type { Supplier, Product } from "@/types"

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Global Tech Supplies",
    contactPerson: "John Smith",
    email: "john@globaltech.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94105",
    status: "active",
    paymentTerms: "Net 30",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Premium Electronics Co.",
    contactPerson: "Sarah Johnson",
    email: "sarah@premiumelec.com",
    phone: "+1 (555) 234-5678",
    address: "456 Electronics Ave, New York, NY 10001",
    status: "active",
    paymentTerms: "Net 45",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
]

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    sku: "WM-001",
    category: "Electronics",
    price: 29.99,
    stock: 150,
    reorderPoint: 50,
    status: "in-stock",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "USB-C Cable",
    sku: "UC-002",
    category: "Electronics",
    price: 12.99,
    stock: 300,
    reorderPoint: 100,
    status: "in-stock",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    category: "Furniture",
    price: 49.99,
    stock: 75,
    reorderPoint: 25,
    status: "in-stock",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function NewPurchaseOrderPage() {
  const router = useRouter()

  const handleSubmit = async (data: PurchaseOrderFormData) => {
    console.log("[v0] Creating purchase order:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/purchasing")
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Purchase Order" description="Create a new purchase order" />
      <PurchaseOrderForm
        suppliers={mockSuppliers}
        products={mockProducts}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
