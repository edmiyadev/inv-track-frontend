"use client"

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
import { useState } from "react"

export default function NewSalesOrderPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: customersResponse, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", "all"],
    queryFn: () => customersApi.getAll(accessToken!, 1, 1000),
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
    mutationFn: (data: SalesOrderFormData) =>
      salesApi.createSale(
        {
          customer_id: data.customerId,
          warehouse_id: data.warehouseId,
          date: data.orderDate,
          notes: data.notes || null,
          items: data.items.map((item) => ({
            product_id: item.productId,
            tax_id: item.taxId ?? null,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
        },
        accessToken!
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] })
      router.push("/sales")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to create sales order")
    },
  })

  const handleSubmit = async (data: SalesOrderFormData) => {
    setError(null)
    await mutation.mutateAsync(data)
  }

  const handleCancel = () => {
    router.push("/sales")
  }

  if (isLoadingCustomers || isLoadingProducts || isLoadingWarehouses || isLoadingTaxes) {
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
      <PageHeader title="Create Sales Order" description="Create a new sales order" />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <SalesOrderForm
        customers={customersResponse?.data.data || []}
        products={productsResponse?.data.data || []}
        warehouses={warehousesResponse?.data.data || []}
        taxes={taxesResponse?.data.data || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
