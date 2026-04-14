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
import { ApiError } from "@/lib/api/client"
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

interface StockInsufficientItem {
  product_name?: string
  available?: number
  requested?: number
  missing?: number
}

const formatStockInsufficientMessage = (error: ApiError): string => {
  if (error.code !== "STOCK_INSUFFICIENT") {
    return error.message || "Error al cambiar estado"
  }

  const details = error.details
  const items = (
    details &&
    typeof details === "object" &&
    "items" in details &&
    Array.isArray((details as { items?: unknown[] }).items)
      ? (details as { items: unknown[] }).items
      : []
  )
    .filter((item): item is StockInsufficientItem => typeof item === "object" && item !== null)

  if (items.length === 0) {
    return error.message || "No hay stock suficiente para completar la operación"
  }

  const lines = items.map((item) => {
    const productName = item.product_name ?? "Producto"
    const requested = typeof item.requested === "number" ? item.requested : 0
    const available = typeof item.available === "number" ? item.available : 0
    const missing = typeof item.missing === "number" ? item.missing : Math.max(requested - available, 0)
    return `${productName}: faltan ${missing} (solicitado: ${requested}, disponible: ${available})`
  })

  return `No hay stock suficiente para postear la venta. ${lines.join(" | ")}`
}

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
      if (err instanceof ApiError) {
        setStatusError(formatStockInsufficientMessage(err))
        return
      }
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
          <p className="text-muted-foreground">Cargando orden...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Orden de Venta" description="Ver detalles de la orden de venta" />
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message || "Error al cargar la orden"}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/sales">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Ventas
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
        description={`Orden de venta para ${order.customer?.name || 'Cliente desconocido'}`}
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
                    Editar
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
            <CardTitle>Detalles de la Orden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Estado</span>
              <Badge variant={order.status === "posted" ? "default" : order.status === "canceled" ? "destructive" : "secondary"}>
                {order.status}
              </Badge>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Fecha de Orden</span>
              <span>{orderDate ? format(orderDate, "PPP") : "Sin fecha"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Nombre</span>
              <span>{order.customer?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span>{order.customer?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Teléfono</span>
              <span>{order.customer?.phone_number || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">ID Fiscal</span>
              <span>{order.customer?.tax_id || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artículos de la Orden</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Impuesto</TableHead>
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
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
