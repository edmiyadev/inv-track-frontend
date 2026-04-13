"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { salesApi } from "@/lib/api/sales"
import { useAuthStore } from "@/lib/store/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import type { SaleItem } from "@/lib/api/types"
import { parseApiDateToLocalDate } from "@/lib/utils"
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

export default function SalesOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { accessToken } = useAuthStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ["sale", resolvedParams.id],
    queryFn: () => salesApi.getSaleById(parseInt(resolvedParams.id), accessToken!),
    enabled: !!accessToken,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: "posted" | "canceled") =>
      salesApi.updateSaleStatus(parseInt(resolvedParams.id), status, accessToken!),
    onSuccess: () => {
      setStatusError(null)
      queryClient.invalidateQueries({ queryKey: ["sale", resolvedParams.id] })
      queryClient.invalidateQueries({ queryKey: ["sales"] })
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
      await salesApi.deleteSale(parseInt(resolvedParams.id), accessToken)
      router.push('/sales')
      router.refresh()
    } catch (err) {
      console.error('Error deleting sale:', err)
      alert('Error al eliminar la orden de venta')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sales Order" description="View sales order details" />
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message || "Error loading order"}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/sales">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sales
          </Link>
        </Button>
      </div>
    )
  }

  const order = response?.data

  if (!order) return null

  const isDraft = order.status === "draft"
  const orderDate = order.date ? parseApiDateToLocalDate(order.date) : null

  const calculateItemAmounts = (item: SaleItem) => {
    const baseAmount = parseFloat(item.unit_price) * item.quantity
    const taxAmount = parseFloat(item.tax_amount)
    return {
      baseAmount,
      taxAmount,
      totalAmount: parseFloat(item.subtotal),
      taxName: item.tax?.name ?? "N/A",
      taxPercentage: Number(item.tax_percentage),
    }
  }

  const summary = order.items?.reduce(
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
    <div className="space-y-6">
      <PageHeader
        title={`SO-${order.id}`}
        description={`Sales order for ${order.customer?.name || 'Unknown Customer'}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/sales">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            {isDraft && (
              <>
                <Button
                  onClick={() => updateStatusMutation.mutate("posted")}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? "Posteando..." : "Postear factura"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateStatusMutation.mutate("canceled")}
                  disabled={updateStatusMutation.isPending}
                >
                  Cancelar factura
                </Button>
                <Button asChild>
                  <Link href={`/sales/orders/${resolvedParams.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
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
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la orden
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
              </>
            )}
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
              <span>{orderDate ? format(orderDate, "PPP") : "Sin fecha"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Name</span>
              <span>{order.customer?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span>{order.customer?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span>{order.customer?.phone_number || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tax ID</span>
              <span>{order.customer?.tax_id || "N/A"}</span>
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
  )
}
