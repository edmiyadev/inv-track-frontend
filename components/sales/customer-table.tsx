"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal, Pencil, Trash2, Eye, Phone, Mail } from "lucide-react"
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
import { customersApi } from "@/lib/api/customers"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { CanAccess } from "@/components/auth/can-access"
import type { Customer } from "@/lib/api/types"

export function CustomerTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["customers", currentPage, itemsPerPage],
    queryFn: () => customersApi.getAll(accessToken!, currentPage, itemsPerPage),
    enabled: !!accessToken,
    staleTime: 30000,
  })

  const customers = data?.data.data || []
  const paginationData = data?.data

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!accessToken || !customerToDelete) return

    try {
      setIsDeleting(true)
      await customersApi.delete(customerToDelete.id, accessToken)
      await refetch()
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    } catch (err) {
      console.error("Error deleting customer:", err)
      alert("Error al eliminar el cliente")
    } finally {
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
        <p className="text-center text-destructive">
          {error instanceof Error ? error.message : "Error al cargar clientes"}
        </p>
      </div>
    )
  }

  if (!isLoading && customers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-muted-foreground">No hay clientes disponibles</p>
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
              <TableHead>Tax ID</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex items-center justify-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="ml-3 text-muted-foreground">Cargando clientes...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium max-w-[240px] truncate">{customer.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{customer.tax_id || "N/A"}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{customer.phone_number || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{customer.email || "N/A"}</span>
                      </div>
                    </div>
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
                        <CanAccess action="view" subject="Customer">
                          <DropdownMenuItem asChild>
                            <Link href={`/customers/${customer.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </Link>
                          </DropdownMenuItem>
                        </CanAccess>
                        <CanAccess action="edit" subject="Customer">
                          <DropdownMenuItem asChild>
                            <Link href={`/customers/${customer.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                        </CanAccess>
                        <CanAccess action="delete" subject="Customer">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(customer)}>
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente
              <strong> {customerToDelete?.name}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
