"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { CustomerForm } from "@/components/sales/customer-form"
import type { CustomerFormData } from "@/lib/validations"

export default function NewCustomerPage() {
  const router = useRouter()

  const handleSubmit = async (data: CustomerFormData) => {
    console.log("[v0] Creating customer:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard/sales")
  }

  const handleCancel = () => {
    router.push("/dashboard/sales")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Customer" description="Create a new customer record" />
      <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
