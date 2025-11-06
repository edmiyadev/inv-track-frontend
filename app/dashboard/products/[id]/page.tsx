"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth"
import { productsApi } from "@/lib/api/products"
import type { Product } from "@/lib/api/types"
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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const accessToken = useAuthStore((state) => state.accessToken)
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!accessToken) return
      
      try {
        setIsLoading(true)
        setError(null)
        const response = await productsApi.getById(parseInt(resolvedParams.id), accessToken)
        setProduct(response.data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.id, accessToken])

  const handleDelete = async () => {
    if (!accessToken || !product) return
    
    try {
      setIsDeleting(true)
      await productsApi.delete(product.id, accessToken)
      router.push('/dashboard/products')
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Error al eliminar el producto')
      setIsDeleting(false)
    }
  }

  const getStockStatus = () => {
    if (!product) return 'in-stock'
    if (product.stock_quantity === 0) return 'out-of-stock'
    if (product.stock_quantity <= product.reorder_point) return 'low-stock'
    return 'in-stock'
  }

  const getStatusBadge = () => {
    const status = getStockStatus()
    
    const variants = {
      "in-stock": "default",
      "low-stock": "secondary",
      "out-of-stock": "destructive",
    } as const

    const labels = {
      "in-stock": "En Stock",
      "low-stock": "Stock Bajo",
      "out-of-stock": "Sin Stock",
    }

    return (
      <Badge variant={variants[status]} className="font-normal">
        {labels[status]}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Productos
          </Link>
        </Button>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
          <p className="text-center text-destructive">{error || 'Producto no encontrado'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <PageHeader
            title={product.name}
            description={`SKU: ${product.sku}`}
            actions={
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                        <strong> {product.name}</strong> del sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button asChild>
                  <Link href={`/dashboard/products/${resolvedParams.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Producto
                  </Link>
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre del Producto</p>
                  <p className="mt-1 text-base">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="mt-1 font-mono text-base">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Categoría</p>
                  <p className="mt-1 text-base">{product.product_category_id || 'Sin categoría'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Precio</p>
                  <p className="mt-1 text-base font-semibold">${product.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Proveedor</p>
                  <p className="mt-1 text-base">{product.supplier_id || 'Sin proveedor'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                <p className="mt-1 text-base">{product.description || 'Sin descripción'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Actual</p>
                <p className="mt-1 text-3xl font-bold">{product.stock_quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Punto de Reorden</p>
                <p className="mt-1 text-base">{product.reorder_point} unidades</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <div className="mt-1">
                  {getStatusBadge()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
