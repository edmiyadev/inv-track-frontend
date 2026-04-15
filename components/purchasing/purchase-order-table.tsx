"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { purchasingApi } from "@/lib/api/purchasing"
import { useAuthStore } from "@/lib/store/auth"
import type { Purchase } from "@/lib/api/types"
import { CanAccess } from "@/components/auth/can-access"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { parseApiDateToLocalDate } from "@/lib/utils"
import { PaginationControls } from "@/components/shared/pagination-controls"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusColors = {
  draft: "secondary",
  posted: "default",
  canceled: "destructive",
} as const

export function PurchaseOrderTable() {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Purchase | null>(null)

  const { data: ordersResponse, isLoading, isError, error } = useQuery({
    queryKey: ["purchases", accessToken, currentPage, itemsPerPage],
    queryFn: () => purchasingApi.getAllPurchases(accessToken!, currentPage, itemsPerPage),
    enabled: !!accessToken,
  })

  const paginationData = ordersResponse?.data
  const orders: Purchase[] = Array.isArray(paginationData?.data) ? paginationData.data : []
  const filteredOrders = orders.filter(
    (order) =>
      (order.supplier?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery)
  )

  const deleteMutation = useMutation({
    mutationFn: (id: number) => purchasingApi.deletePurchase(id, accessToken!),
    onSuccess: async (_, deletedId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["purchases"] }),
        queryClient.invalidateQueries({ queryKey: ["purchase", String(deletedId)] }),
      ])
      setDeleteDialogOpen(false)
      setOrderToDelete(null)
    },
  })

  const handleDeleteClick = (order: Purchase) => {
    setOrderToDelete(order)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return
    await deleteMutation.mutateAsync(orderToDelete.id)
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Error al cargar las compras"}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar compras..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° de Orden</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron compras.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">PO-{order.id.toString().padStart(6, '0')}</TableCell>
                  <TableCell>{order.supplier?.name || "Proveedor desconocido"}</TableCell>
                  <TableCell>
                    {order.date
                      ? parseApiDateToLocalDate(order.date)?.toLocaleDateString() ?? "Sin fecha"
                      : "Sin fecha"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status] || "default"}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <CanAccess action="view" subject="Purchase">
                          <DropdownMenuItem asChild>
                            <Link href={`/purchasing/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </Link>
                          </DropdownMenuItem>
                        </CanAccess>
                        {order.status === 'draft' && (
                          <>
                            <CanAccess action="edit" subject="Purchase">
                              <DropdownMenuItem asChild>
                                <Link href={`/purchasing/orders/${order.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                            </CanAccess>
                            <CanAccess action="delete" subject="Purchase">
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClick(order)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </CanAccess>
                          </>

                        )}
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginationData && (
        <PaginationControls
          currentPage={paginationData.current_page}
          totalPages={paginationData.last_page}
          totalItems={paginationData.total}
          itemsPerPage={paginationData.per_page}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
          }}
          isLoading={isLoading}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la orden
              <strong> PO-{orderToDelete?.id.toString().padStart(6, "0")}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
