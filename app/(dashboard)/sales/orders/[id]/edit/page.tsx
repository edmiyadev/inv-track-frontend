"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { SalesOrderForm } from "@/components/sales/sales-order-form"
import type { SalesOrderFormData } from "@/lib/validations"
import { salesApi } from "@/lib/api/sales"
import { customersApi } from "@/lib/api/customers"
import { productsApi } from "@/lib/api/products"
import { warehousesApi } from "@/lib/api/warehouses"
import { taxesApi } from "@/lib/api/taxes"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EditSalesOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: orderResponse, isLoading: isLoadingOrder, isError, error: fetchError } = useQuery({
    queryKey: ["sale", resolvedParams.id],
    queryFn: () => salesApi.getSaleById(parseInt(resolvedParams.id), accessToken!),
    enabled: !!accessToken,
  })

  const { data: customersResponse, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", "all"],
    queryFn: () => customersApi.getAll(accessToken!, 1, 1000),
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
    mutationFn: (data: SalesOrderFormData) =>
      salesApi.updateSale(
        parseInt(resolvedParams.id),
        {
          customer_id: data.customerId,
          warehouse_id: data.warehouseId,
          date: data.orderDate,
          notes: data.notes || null,
          items: data.items.map((item) => ({
            product_id: item.productId,
            tax_id: item.taxId ?? null,
            tax_percentage: item.taxId
              ? Number(taxesResponse?.data.data.find((tax) => tax.id === item.taxId)?.percentage ?? 0)
              : 0,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
        },
        accessToken!
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] })
      queryClient.invalidateQueries({ queryKey: ["sale", resolvedParams.id] })
      router.push("/sales")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to update sales order")
    },
  })

  const handleSubmit = async (data: SalesOrderFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/sales")
  }

  if (isLoadingOrder || isLoadingCustomers || isLoadingWarehouses || isLoadingProducts || isLoadingTaxes) {
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
        <PageHeader title="Edit Sales Order" description="Update sales order details" />
        <Alert variant="destructive">
          <AlertDescription>{(fetchError as Error).message || "Error loading order"}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/sales">
            Back to Sales
          </Link>
        </Button>
      </div>
    )
  }

  const order = orderResponse?.data
  const isEditable = order?.status === "draft"

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit SO-${order?.id}`} description="Update sales order details" />
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
          <SalesOrderForm
            order={order}
            customers={customersResponse?.data.data || []}
            products={productsResponse?.data.data || []}
            warehouses={warehousesResponse?.data.data || []}
            taxes={taxesResponse?.data.data || []}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <Button asChild variant="outline">
            <Link href={`/sales/orders/${resolvedParams.id}`}>Volver al detalle</Link>
          </Button>
        )
      )}
    </div>
  )
}
