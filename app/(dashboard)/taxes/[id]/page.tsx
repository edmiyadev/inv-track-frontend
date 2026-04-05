"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/layout/page-header"
import { useAuthStore } from "@/lib/store/auth"
import { taxesApi } from "@/lib/api/taxes"
import type { Tax } from "@/lib/api/types"

export default function TaxDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [tax, setTax] = useState<Tax | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const loadTax = async () => {
      if (!accessToken) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await taxesApi.getById(parseInt(resolvedParams.id), accessToken)
        setTax(response.data)
      } catch (err) {
        console.error('Error loading tax:', err)
        setError('Error al cargar el impuesto')
      } finally {
        setIsLoading(false)
      }
    }

    loadTax()
  }, [resolvedParams.id, accessToken])

  const handleDelete = async () => {
    if (!accessToken || !tax) return

    try {
      setIsDeleting(true)
      await taxesApi.delete(tax.id, accessToken)
      router.push('/taxes')
      router.refresh()
    } catch (err) {
      console.error('Error deleting tax:', err)
      alert('Error al eliminar el impuesto')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="ml-3 text-muted-foreground">Cargando impuesto...</p>
      </div>
    )
  }

  if (error || !tax) {
    return (
      <div className="space-y-6">
        <PageHeader title="Error" description="No se pudo cargar el impuesto" />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
          <p className="text-center text-destructive">{error || 'Impuesto no encontrado'}</p>
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/taxes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Impuestos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={tax.name}
        description="Detalles del impuesto"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/taxes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/taxes/${tax.id}/edit`}>
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
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el impuesto
                    <strong> {tax.name}</strong> del sistema.
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
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos principales del impuesto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="text-lg">{tax.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <div className="mt-1">
                  {tax.is_active ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      Inactivo
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-lg font-medium">{tax.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Porcentaje</p>
              <p className="text-2xl font-bold">{tax.percentage}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Descripción</p>
              <p className="text-base text-muted-foreground">{tax.description || 'Sin descripción'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fechas</CardTitle>
            <CardDescription>Información de registro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Creado</p>
              <p className="text-lg">
                {new Date(tax.created_at).toLocaleString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
              <p className="text-lg">
                {new Date(tax.updated_at).toLocaleString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
