"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal, Pencil, Trash2, Eye, Phone, Mail, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { suppliersApi } from "@/lib/api/suppliers"
import { PaginationControls } from "@/components/shared/pagination-controls"
import type { Supplier } from "@/lib/api/types"

export function SupplierTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)

  // TanStack Query para obtener proveedores con paginación
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['suppliers', currentPage, itemsPerPage],
    queryFn: () => suppliersApi.getAll(accessToken!, currentPage, itemsPerPage),
    enabled: !!accessToken,
    staleTime: 30000, // 30 segundos
  })

  const suppliers = data?.data.data || []
  const paginationData = data?.data

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!accessToken || !supplierToDelete) return
    
    try {
      setIsDeleting(true)
      await suppliersApi.delete(supplierToDelete.id, accessToken)
      // Refrescar la lista de proveedores después de eliminar
      await refetch()
      setDeleteDialogOpen(false)
      setSupplierToDelete(null)
    } catch (err) {
      console.error('Error deleting supplier:', err)
      alert('Error al eliminar el proveedor')
    } finally {
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
        <p className="text-center text-destructive">
          {error instanceof Error ? error.message : 'Error al cargar proveedores'}
        </p>
      </div>
    )
  }

  if (!isLoading && suppliers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-muted-foreground">No hay proveedores disponibles</p>
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
              <TableHead>RNC</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="ml-3 text-muted-foreground">Cargando proveedores...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{supplier.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{supplier.rnc}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{supplier.phone_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{supplier.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-xs">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-1 shrink-0" />
                      <span className="text-sm max-w-[150px] truncate text-muted-foreground line-clamp-2">{supplier.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.is_active ? "default" : "secondary"}>
                      {supplier.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/suppliers/${supplier.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/suppliers/${supplier.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteClick(supplier)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      {paginationData && (
        <PaginationControls
          currentPage={paginationData.current_page}
          totalPages={paginationData.last_page}
          totalItems={paginationData.total}
          itemsPerPage={paginationData.per_page}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1) // Resetear a la primera página cuando cambie items por página
          }}
          isLoading={isLoading}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proveedor
              <strong> {supplierToDelete?.name}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
