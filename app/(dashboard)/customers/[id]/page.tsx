"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Phone, Mail, Hash, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PageHeader } from "@/components/layout/page-header"
import { useAuthStore } from "@/lib/store/auth"
import { customersApi } from "@/lib/api/customers"
import { CanAccess } from "@/components/auth/can-access"
import { ProtectedRoute } from "@/components/auth/protected-route"
import type { Customer } from "@/lib/api/types"

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const loadCustomer = async () => {
      if (!accessToken) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await customersApi.getById(parseInt(resolvedParams.id), accessToken)
        setCustomer(response.data)
      } catch (err) {
        console.error("Error loading customer:", err)
        setError("Error al cargar el cliente")
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomer()
  }, [resolvedParams.id, accessToken])

  const handleDelete = async () => {
    if (!accessToken || !customer) return

    try {
      setIsDeleting(true)
      await customersApi.delete(customer.id, accessToken)
      router.push("/customers")
      router.refresh()
    } catch (err) {
      console.error("Error deleting customer:", err)
      alert("Error al eliminar el cliente")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ProtectedRoute action="view" subject="Customer" redirectTo="/unauthorized">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="ml-3 text-muted-foreground">Cargando cliente...</p>
        </div>
      ) : error || !customer ? (
        <div className="space-y-6">
          <PageHeader title="Error" description="No se pudo cargar el cliente" />
          <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
            <p className="text-center text-destructive">{error || "Cliente no encontrado"}</p>
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href="/customers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Clientes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <PageHeader
            title={customer.name}
            description="Detalles del cliente"
            actions={
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/customers">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                  </Link>
                </Button>
                <CanAccess action="edit" subject="Customer">
                  <Button asChild>
                    <Link href={`/customers/${customer.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                </CanAccess>
                <CanAccess action="delete" subject="Customer">
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
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente
                          <strong> {customer.name}</strong> del sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CanAccess>
              </div>
            }
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos principales del cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Cédula</p>
                    <p className="text-lg font-mono">{customer.tax_id || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Datos de contacto del cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                    <p className="text-lg">{customer.phone_number || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{customer.email || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Fechas</CardTitle>
                <CardDescription>Información de registro</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Creado</p>
                    <p className="text-lg">
                      {new Date(customer.created_at).toLocaleString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                    <p className="text-lg">
                      {new Date(customer.updated_at).toLocaleString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          )}
    </ProtectedRoute>
  )
}
