"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { SalesOrderForm } from "@/components/sales/sales-order-form"
import type { SalesOrderFormData } from "@/lib/validations"
import type { Customer, Product } from "@/types"

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "jane@acme.com",
    phone_number: "+1 (555) 111-2222",
    tax_id: "123456789",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    name: "Tech Solutions Inc.",
    email: "bob@techsolutions.com",
    phone_number: "+1 (555) 333-4444",
    tax_id: "987654321",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
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

export default function NewSalesOrderPage() {
  const router = useRouter()

  const handleSubmit = async (data: SalesOrderFormData) => {
    console.log("[v0] Creating sales order:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/sales")
  }

  const handleCancel = () => {
    router.push("/sales")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Sales Order" description="Create a new sales order" />
      <SalesOrderForm
        customers={mockCustomers}
        products={mockProducts}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
