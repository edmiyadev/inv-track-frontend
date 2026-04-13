"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { purchasingApi } from "@/lib/api/purchasing"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import type { PurchaseItem, Tax } from "@/lib/api/types"
import { taxesApi } from "@/lib/api/taxes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { CanAccess } from "@/components/auth/can-access"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { accessToken } = useAuthStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()


  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ["purchase", resolvedParams.id],
    queryFn: () => purchasingApi.getPurchaseById(parseInt(resolvedParams.id), accessToken!),
    enabled: !!accessToken,
  })

  const { data: taxesResponse } = useQuery({
    queryKey: ["taxes", "all"],
    queryFn: () => taxesApi.getAll(accessToken!, 1, 1000),
    enabled: !!accessToken,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: "draft" | "posted" | "canceled") =>
      purchasingApi.updatePurchaseStatus(parseInt(resolvedParams.id), status, accessToken!),
    onSuccess: () => {
      setStatusError(null)
      queryClient.invalidateQueries({ queryKey: ["purchase", resolvedParams.id] })
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
      queryClient.invalidateQueries({ queryKey: ["stocks"] })
      queryClient.invalidateQueries({ queryKey: ["movements"] })
    },
    onError: (err: Error) => {
      setStatusError(err.message || "Error al cambiar estado")
    },
  })

  const handleDelete = async () => {
    if (!accessToken || !order) return

    try {
      setIsDeleting(true)
      await purchasingApi.deletePurchase(parseInt(resolvedParams.id), accessToken)
      router.push('/purchasing')

      router.refresh()
    } catch (err) {
      console.error('Error deleting purchase:', err)
      alert('Error al eliminar el pedido')
    } finally {
      setIsDeleting(false)
    }
  }

  const order = response?.data

  const isDraft = order?.status === "draft"
  const isCanceled = order?.status === "canceled"

  const taxes = taxesResponse?.data.data || []
  const getTax = (taxId?: number | null) => taxes.find((tax) => tax.id === taxId)

  const calculateItemAmounts = (item: PurchaseItem) => {
    const baseAmount = parseFloat(item.unit_price) * item.quantity
    const taxInfo = getTax(item.tax_id)
    const taxPercentage = Number(taxInfo?.percentage ?? 0)
    const taxAmount = baseAmount * (taxPercentage / 100)
    return {
      baseAmount,
      taxAmount,
      totalAmount: baseAmount + taxAmount,
      taxName: taxInfo?.name ?? "N/A",
      taxPercentage,
    }
  }

  const summary = order?.items?.reduce(
    (acc, item) => {
      const { baseAmount, taxAmount, totalAmount } = calculateItemAmounts(item)
      acc.subtotal += baseAmount
      acc.tax += taxAmount
      acc.total += totalAmount
      return acc
    },
    { subtotal: 0, tax: 0, total: 0 }
  ) || { subtotal: 0, tax: 0, total: 0 }

  return (
    <ProtectedRoute action="view" subject="Purchase" redirectTo="/unauthorized">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading order...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="space-y-6">
          <PageHeader title="Purchase Order" description="View purchase order details" />
          <Alert variant="destructive">
            <AlertDescription>{(error as Error).message || "Error loading order"}</AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link href="/purchasing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchasing
            </Link>
          </Button>
        </div>
      ) : !order ? null : (
      <div className="space-y-6">
        <PageHeader
          title={`PO-${order.id}`}
          description={`Purchase order for ${order.supplier?.name || 'Unknown Supplier'}`}
          actions={
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/purchasing">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Link>
              </Button>
              {isDraft && (
                <>
                  <CanAccess action="edit" subject="Purchase">
                    <Button
                      onClick={() => updateStatusMutation.mutate("posted")}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? "Posteando..." : "Postear factura"}
                    </Button>
                  </CanAccess>
                  <CanAccess action="edit" subject="Purchase">
                    <Button
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate("canceled")}
                      disabled={updateStatusMutation.isPending}
                    >
                      Cancelar factura
                    </Button>
                  </CanAccess>
                  <CanAccess action="edit" subject="Purchase">
                    <Button asChild>
                      <Link href={`/purchasing/orders/${resolvedParams.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </CanAccess>
                  <CanAccess action="delete" subject="Purchase">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido
                            <strong> {order.id}</strong> del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CanAccess>
                </>
              )}
              {isCanceled && (
                <CanAccess action="edit" subject="Purchase">
                  <Button
                    variant="outline"
                    onClick={() => updateStatusMutation.mutate("draft")}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? "Restaurando..." : "Volver a borrador"}
                  </Button>
                </CanAccess>
              )}
              {/* <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button> */}
            </div>
          }
        />

      {statusError && (
        <Alert variant="destructive">
          <AlertDescription>{statusError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={order.status === "posted" ? "default" : order.status === "canceled" ? "destructive" : "secondary"}>
                {order.status}
              </Badge>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Order Date</span>
              <span>{format(new Date(order.purchase_date || order.created_at), "PPP")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Name</span>
              <span>{order.supplier?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span>{order.supplier?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span>{order.supplier?.phone_number || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Address</span>
              <span>{order.supplier?.address || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items?.map((item) => {
                const { taxAmount, totalAmount, taxName, taxPercentage } = calculateItemAmounts(item)

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.product?.sku}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${parseFloat(item.unit_price).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {taxName === "N/A" ? "N/A" : `${taxName} (${taxPercentage}%)`} - ${taxAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">${totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="mt-6 space-y-2 text-right">
            <div className="flex justify-end gap-4">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium w-24">${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-muted-foreground">Impuestos:</span>
              <span className="font-medium w-24">${summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-4 text-lg font-bold">
              <span>Total:</span>
              <span className="w-24">${summary.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
      </div>
      )}
    </ProtectedRoute>
  )
}
