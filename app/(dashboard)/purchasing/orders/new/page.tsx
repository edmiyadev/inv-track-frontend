"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { PurchaseOrderForm } from "@/components/purchasing/purchase-order-form"
import type { PurchaseOrderFormData } from "@/lib/validations"
import { purchasingApi } from "@/lib/api/purchasing"
import { productsApi } from "@/lib/api/products"
import { warehousesApi } from "@/lib/api/warehouses"
import { taxesApi } from "@/lib/api/taxes"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: suppliersResponse, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["suppliers", "all"],
    queryFn: () => purchasingApi.getAllSuppliers(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const { data: warehousesResponse, isLoading: isLoadingWarehouses } = useQuery({
    queryKey: ["warehouses", "all"],
    queryFn: () => warehousesApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const { data: taxesResponse, isLoading: isLoadingTaxes } = useQuery({
    queryKey: ["taxes", "all"],
    queryFn: () => taxesApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const mutation = useMutation({
    mutationFn: (data: PurchaseOrderFormData) => purchasingApi.createPurchase({
      supplier_id: data.supplierId,
      warehouse_id: data.warehouseId || null,
notes: data.notes || null,
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))
    }, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
      router.push("/purchasing")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to create purchase order")
    },
  })

  const handleSubmit = async (data: PurchaseOrderFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  if (isLoadingSuppliers || isLoadingProducts || isLoadingWarehouses || isLoadingTaxes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Purchase Order" description="Create a new purchase order" />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PurchaseOrderForm
        suppliers={suppliersResponse?.data.data || []}
        products={productsResponse?.data.data || []}
        warehouses={warehousesResponse?.data.data || []}
        taxes={taxesResponse?.data.data || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
