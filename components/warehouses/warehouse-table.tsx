"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal, Pencil, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuthStore } from "@/lib/store/auth"
import { warehousesApi } from "@/lib/api/warehouses"
import { PaginationControls } from "@/components/shared/pagination-controls"
import type { Warehouse } from "@/lib/api/types"
import { toast } from "sonner"
import { CanAccess } from "@/components/auth/can-access"

export function WarehouseTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['warehouses', currentPage, itemsPerPage],
    queryFn: () => warehousesApi.getAll(accessToken!, currentPage, itemsPerPage),
    enabled: !!accessToken,
    staleTime: 30000,
  })

  const warehouses = data?.data.data || []
  const paginationData = data?.data

  const handleDeleteClick = (warehouse: Warehouse) => {
    setWarehouseToDelete(warehouse)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!accessToken || !warehouseToDelete) return
    
    try {
      setIsDeleting(true)
      await warehousesApi.delete(warehouseToDelete.id, accessToken)
      await refetch()
      setDeleteDialogOpen(false)
      setWarehouseToDelete(null)
      toast.success("Almacén eliminado correctamente")
    } catch (err) {
      console.error('Error deleting warehouse:', err)
      toast.error("Error al eliminar el almacén")
    } finally {
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
        <p className="text-center text-destructive">
          {error instanceof Error ? error.message : 'Error al cargar almacenes'}
        </p>
      </div>
    )
  }

  if (!isLoading && warehouses.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-muted-foreground">No hay almacenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-32 animate-pulse rounded bg-muted" /></TableCell>
                  <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted" /></TableCell>
                  <TableCell><div className="h-4 w-40 animate-pulse rounded bg-muted" /></TableCell>
                  <TableCell><div className="h-4 w-48 animate-pulse rounded bg-muted" /></TableCell>
                  <TableCell className="text-right"><div className="ml-auto h-8 w-8 animate-pulse rounded bg-muted" /></TableCell>
                </TableRow>
              ))
            ) : (
              warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.code}</TableCell>
                  <TableCell>
                    {warehouse.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">{warehouse.location}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {warehouse.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <CanAccess action="edit" subject="Warehouse">
                          <DropdownMenuItem asChild>
                            <Link href={`/warehouses/${warehouse.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                        </CanAccess>
                        <CanAccess action="delete" subject="Warehouse">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(warehouse)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </CanAccess>
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
          currentPage={currentPage}
          totalPages={paginationData.last_page}
          onPageChange={setCurrentPage}
          totalItems={paginationData.total}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el almacén
              <span className="font-medium text-foreground"> {warehouseToDelete?.name} </span>
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
