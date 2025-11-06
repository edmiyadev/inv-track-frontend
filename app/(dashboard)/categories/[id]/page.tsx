"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
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
import { categoriesApi } from "@/lib/api/categories"
import type { ProductCategory } from "@/lib/api/types"

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const loadCategory = async () => {
      if (!accessToken) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await categoriesApi.getById(parseInt(resolvedParams.id), accessToken)
        setCategory(response.data)
      } catch (err) {
        console.error('Error loading category:', err)
        setError('Error al cargar la categoría')
      } finally {
        setIsLoading(false)
      }
    }

    loadCategory()
  }, [resolvedParams.id, accessToken])

  const handleDelete = async () => {
    if (!accessToken || !category) return

    try {
      setIsDeleting(true)
      await categoriesApi.delete(category.id, accessToken)
      router.push('/categories')
      router.refresh()
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Error al eliminar la categoría')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="ml-3 text-muted-foreground">Cargando categoría...</p>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <PageHeader title="Error" description="No se pudo cargar la categoría" />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
          <p className="text-center text-destructive">{error || 'Categoría no encontrada'}</p>
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Categorías
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
        title={category.name}
        description="Detalles de la categoría"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/categories/${category.id}/edit`}>
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
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría
                    <strong> {category.name}</strong> del sistema.
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
            <CardDescription>Datos principales de la categoría</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-lg">{category.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-lg font-medium">{category.name}</p>
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
                {new Date(category.created_at).toLocaleString('es-MX', {
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
                {new Date(category.updated_at).toLocaleString('es-MX', {
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
