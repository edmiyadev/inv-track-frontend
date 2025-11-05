"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/purchasing/supplier-form"
import type { SupplierFormData } from "@/lib/validations"

export default function NewSupplierPage() {
  const router = useRouter()

  const handleSubmit = async (data: SupplierFormData) => {
    console.log("[v0] Creating supplier:", data)
    // TODO: Implement API call to create supplier
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/purchasing")
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Supplier" description="Create a new supplier record" />
      <SupplierForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
