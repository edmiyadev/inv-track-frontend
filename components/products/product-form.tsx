"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { useAuthStore } from "@/lib/store/auth"
import { productsApi } from "@/lib/api/products"
import { categoriesApi } from "@/lib/api/categories"
import { suppliersApi } from "@/lib/api/suppliers"
import type { Product } from "@/lib/api/types"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

// Validation schema matching API structure
const productFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  sku: z
    .string()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(50, "El SKU es demasiado largo")
    .regex(/^[A-Z0-9-]+$/, "El SKU solo puede contener letras mayúsculas, números y guiones"),
  description: z.string().max(500, "La descripción es demasiado larga").optional().or(z.literal("")),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "El precio debe ser un número válido con máximo 2 decimales"),
  stock_quantity: z.coerce.number().int("El stock debe ser un número entero").min(0, "El stock no puede ser negativo"),
  reorder_point: z.coerce.number().int("El punto de reorden debe ser un número entero").min(0, "El punto de reorden no puede ser negativo"),
  product_category_id: z.string().optional(),
  supplier_id: z.string().optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

// Helper to transform form data to API format
const transformToApiData = (data: ProductFormData) => ({
  name: data.name,
  sku: data.sku,
  description: data.description || null,
  price: data.price,
  stock_quantity: data.stock_quantity,
  reorder_point: data.reorder_point,
  product_category_id: data.product_category_id && data.product_category_id !== "" ? parseInt(data.product_category_id) : null,
  supplier_id: data.supplier_id && data.supplier_id !== "" ? parseInt(data.supplier_id) : null,
})

interface ProductFormProps {
  mode: "create" | "edit"
  defaultValues?: Product
  productId?: number
}

export function ProductForm({ mode, defaultValues, productId }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)
  const router = useRouter()

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      if (!accessToken) throw new Error('No token')
      // Fetch all categories (large per_page to get all)
      return categoriesApi.getAll(accessToken, 1, 100)
    },
    enabled: !!accessToken,
    staleTime: 60000, // 1 minute
  })

  // Fetch suppliers
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers', 'all'],
    queryFn: async () => {
      if (!accessToken) throw new Error('No token')
      // Fetch all active suppliers
      return suppliersApi.getAll(accessToken, 1, 100)
    },
    enabled: !!accessToken,
    staleTime: 60000, // 1 minute
  })

  const categories = categoriesData?.data.data || []
  const suppliers = suppliersData?.data.data.filter(s => s.is_active) || []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      sku: defaultValues.sku,
      description: defaultValues.description || "",
      price: defaultValues.price,
      stock_quantity: defaultValues.stock_quantity,
      reorder_point: defaultValues.reorder_point,
      product_category_id: defaultValues.product_category_id?.toString() || "",
      supplier_id: defaultValues.supplier_id?.toString() || "",
    } : undefined,
  })

  const categoryId = watch("product_category_id")
  const supplierId = watch("supplier_id")

  const handleFormSubmit = async (data: ProductFormData) => {
    if (!accessToken) {
      alert('No estás autenticado')
      return
    }

    setIsSubmitting(true)
    try {
      const productData = transformToApiData(data)

      if (mode === "create") {
        await productsApi.create(productData, accessToken)
        router.push('/products')
      } else if (productId) {
        await productsApi.update(productId, productData, accessToken)
        router.push(`/products/${productId}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert(mode === "create" ? 'Error al crear el producto' : 'Error al actualizar el producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>Ingresa los detalles y especificaciones del producto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Producto <span className="text-destructive">*</span>
              </Label>
              <Input id="name" placeholder="Ingresa el nombre del producto" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-destructive">*</span>
              </Label>
              <Input id="sku" placeholder="ej., PRD-001" className="font-mono" {...register("sku")} />
              {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
              <p className="text-xs text-muted-foreground">Usa solo letras mayúsculas, números y guiones</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Ingresa la descripción del producto" rows={4} {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_category_id">Categoría</Label>
              <Select
                value={categoryId || "none"}
                onValueChange={(value) => setValue("product_category_id", value === "none" ? "" : value)}
                disabled={isLoadingCategories}
              >
                <SelectTrigger id="product_category_id">
                  <SelectValue placeholder={isLoadingCategories ? "Cargando..." : "Selecciona una categoría"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_category_id && (
                <p className="text-sm text-destructive">{errors.product_category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_id">Proveedor</Label>
              <Select
                value={supplierId || "none"}
                onValueChange={(value) => setValue("supplier_id", value === "none" ? "" : value)}
                disabled={isLoadingSuppliers}
              >
                <SelectTrigger id="supplier_id">
                  <SelectValue placeholder={isLoadingSuppliers ? "Cargando..." : "Selecciona un proveedor"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin proveedor</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplier_id && (
                <p className="text-sm text-destructive">{errors.supplier_id.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Solo se muestran proveedores activos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precio e Inventario</CardTitle>
          <CardDescription>Configura el precio y detalles de gestión de stock</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">
                Precio <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="text"
                  placeholder="0.00"
                  className="pl-7"
                  {...register("price")}
                />
              </div>
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">
                Stock Actual <span className="text-destructive">*</span>
              </Label>
              <Input id="stock_quantity" type="number" placeholder="0" {...register("stock_quantity")} />
              {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorder_point">
                Punto de Reorden <span className="text-destructive">*</span>
              </Label>
              <Input id="reorder_point" type="number" placeholder="0" {...register("reorder_point")} />
              {errors.reorder_point && <p className="text-sm text-destructive">{errors.reorder_point.message}</p>}
              <p className="text-xs text-muted-foreground">Alerta cuando el stock caiga por debajo de este nivel</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting} asChild>
          <Link href={mode === "edit" && productId ? `/products/${productId}` : "/products"}>
            Cancelar
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Crear Producto" : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  )
}
