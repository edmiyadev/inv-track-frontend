"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { PurchaseOrderForm } from "@/components/purchasing/purchase-order-form"
import type { PurchaseOrderFormData } from "@/lib/validations"
import { purchasingApi } from "@/lib/api/purchasing"
import { productsApi } from "@/lib/api/products"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: orderResponse, isLoading: isLoadingOrder, isError, error: fetchError } = useQuery({
    queryKey: ["purchase", resolvedParams.id],
    queryFn: () => purchasingApi.getPurchaseById(parseInt(resolvedParams.id), accessToken!),
    enabled: !!accessToken,
  })

  const { data: suppliersResponse, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["suppliers", "all"],
    queryFn: () => purchasingApi.getAllSuppliers(accessToken!, 1, 100),
    enabled: !!accessToken,
  })

  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsApi.getAll(accessToken!, 1, 100),
    enabled: !!accessToken,
  })

  const mutation = useMutation({
    mutationFn: (data: PurchaseOrderFormData) => purchasingApi.updatePurchase(parseInt(resolvedParams.id), {
      notes: data.notes || null,
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))
    }, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
      queryClient.invalidateQueries({ queryKey: ["purchase", resolvedParams.id] })
      router.push("/purchasing")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to update purchase order")
    },
  })

  const handleSubmit = async (data: PurchaseOrderFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  if (isLoadingOrder || isLoadingSuppliers || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Purchase Order" description="Update purchase order details" />
        <Alert variant="destructive">
          <AlertDescription>{(fetchError as Error).message || "Error loading order"}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/purchasing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchasing
          </Link>
        </Button>
      </div>
    )
  }

  const order = orderResponse?.data

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit PO-${order?.id}`} description="Update purchase order details" />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {order && (
        <PurchaseOrderForm
          order={order}
          suppliers={suppliersResponse?.data.data || []}
          products={productsResponse?.data.data || []}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
