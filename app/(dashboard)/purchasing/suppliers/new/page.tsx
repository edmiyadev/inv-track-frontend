"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/purchasing/supplier-form"
import type { SupplierFormData } from "@/lib/validations"
import { purchasingApi } from "@/lib/api/purchasing"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export default function NewSupplierPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: SupplierFormData) => purchasingApi.createSupplier({
      name: data.name,
      rnc: data.rnc || null,
      email: data.email || null,
      phone_number: data.phone_number || null,
      address: data.address || null,
      is_active: data.is_active,
    }, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      router.push("/purchasing")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to create supplier")
    },
  })

  const handleSubmit = async (data: SupplierFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Supplier" description="Create a new supplier record" />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <SupplierForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
