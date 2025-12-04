"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/purchasing/supplier-form"
import type { SupplierFormData } from "@/lib/validations"
import { purchasingApi } from "@/lib/api/purchasing"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: response, isLoading, isError, error: fetchError } = useQuery({
    queryKey: ["supplier", resolvedParams.id],
    queryFn: () => purchasingApi.getSupplierById(parseInt(resolvedParams.id), accessToken!),
    enabled: !!accessToken,
  })

  const mutation = useMutation({
    mutationFn: (data: SupplierFormData) => purchasingApi.updateSupplier(parseInt(resolvedParams.id), {
      name: data.name,
      rnc: data.rnc || null,
      email: data.email || null,
      phone_number: data.phone_number || null,
      address: data.address || null,
      is_active: data.is_active,
    }, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier", resolvedParams.id] })
      router.push("/purchasing")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to update supplier")
    },
  })

  const handleSubmit = async (data: SupplierFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading supplier...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Supplier" description="Update supplier information" />
        <Alert variant="destructive">
          <AlertDescription>
            {(fetchError as Error).message || "Error loading supplier"}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/purchasing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Link>
        </Button>
      </div>
    )
  }

  const supplier = response?.data

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Supplier" description={`Update information for ${supplier?.name}`} />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {supplier && (
        <SupplierForm
          supplier={supplier}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
