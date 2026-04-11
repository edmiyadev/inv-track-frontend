"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { ProductForm } from "@/components/products/product-form"
import { useAuthStore } from "@/lib/store/auth"
import { productsApi } from "@/lib/api/products"
import type { Product } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
          <Link href="/products">
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
      <PageHeader title="Editar Producto" description={`Editando: ${product.name}`} />

      <ProductForm mode="edit" defaultValues={product} productId={parseInt(resolvedParams.id)} />
    </div>
  )
}
