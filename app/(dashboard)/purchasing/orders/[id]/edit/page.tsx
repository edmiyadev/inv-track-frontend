"use client"

import { use, useState } from "react"
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
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"

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
    queryFn: () => purchasingApi.getAllSuppliers(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const { data: warehousesResponse, isLoading: isLoadingWarehouses } = useQuery({
    queryKey: ["warehouses", "all"],
    queryFn: () => warehousesApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const { data: taxesResponse, isLoading: isLoadingTaxes } = useQuery({
    queryKey: ["taxes", "all"],
    queryFn: () => taxesApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const mutation = useMutation({
    mutationFn: (data: PurchaseOrderFormData) => purchasingApi.updatePurchase(parseInt(resolvedParams.id), {
      supplier_id: data.supplierId,
      warehouse_id: data.warehouseId || null,
      date: `${data.orderDate} 00:00:00`,
      notes: data.notes || null,
      items: data.items.map(item => ({
        product_id: item.productId,
        tax_id: item.taxId ?? null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }))
    }, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
      queryClient.invalidateQueries({ queryKey: ["purchase", resolvedParams.id] })
      router.push("/purchasing")
    },
    onError: (err: any) => {
      setError(err.message || "Error al actualizar la orden de compra")
    },
  })

  const handleSubmit = async (data: PurchaseOrderFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/purchasing")
  }

  if (isLoadingOrder || isLoadingSuppliers || isLoadingWarehouses || isLoadingProducts || isLoadingTaxes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Editar Orden de Compra" description="Actualizar detalles de la orden de compra" />
        <Alert variant="destructive">
          <AlertDescription>{(fetchError as Error).message || "Error al cargar la orden"}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/purchasing">
            Volver a Compras
          </Link>
        </Button>
      </div>
    )
  }

  const order = orderResponse?.data
  const isEditable = order?.status === "draft"

  return (
    <ProtectedRoute action="edit" subject="Purchase" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader title={`Editar PO-${order?.id}`} description="Actualizar detalles de la orden de compra" />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {order && !isEditable && (
          <Alert variant="destructive">
            <AlertDescription>
              Esta factura está en estado <strong>{order.status}</strong> y no se puede editar.
            </AlertDescription>
          </Alert>
        )}
        {order && (
          isEditable ? (
            <PurchaseOrderForm
              order={order}
              suppliers={suppliersResponse?.data.data || []}
              products={productsResponse?.data.data || []}
              warehouses={warehousesResponse?.data.data || []}
              taxes={taxesResponse?.data.data || []}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <Button asChild variant="outline">
              <Link href={`/purchasing/orders/${resolvedParams.id}`}>Volver al detalle</Link>
            </Button>
          )
        )}
      </div>
    </ProtectedRoute>
  )
}
