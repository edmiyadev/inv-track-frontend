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
import { taxesApi } from "@/lib/api/taxes"
import type { Product, Tax } from "@/lib/api/types"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"

// Validation schema matching API structure
const productFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(255, "El nombre es demasiado largo"),
  sku: z
    .string()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(255, "El SKU es demasiado largo"),
  description: z.string().max(1000, "La descripción es demasiado larga").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  product_category_id: z.string().min(1, "La categoría es requerida"),
  tax_id: z.string().optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

// Helper to transform form data to API format
const transformToApiData = (data: ProductFormData) => ({
  name: data.name,
  sku: data.sku,
  description: data.description || null,
  price: data.price,
  product_category_id: parseInt(data.product_category_id),
  tax_id: data.tax_id && data.tax_id !== "" ? parseInt(data.tax_id) : null,
})

interface ProductFormProps {
  mode: "create" | "edit"
  defaultValues?: Product
  productId?: number
}

export function ProductForm({ mode, defaultValues, productId }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
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

  // Fetch taxes
  const { data: taxesData, isLoading: isLoadingTaxes } = useQuery({
    queryKey: ['taxes', 'all'],
    queryFn: async () => {
      if (!accessToken) throw new Error('No token')
      return taxesApi.getAll(accessToken, 1, 100)
    },
    enabled: !!accessToken,
    staleTime: 60000,
  })

  const categories = categoriesData?.data.data || []
  const taxes: Tax[] = taxesData?.data.data.filter((t: Tax) => t.is_active) || []

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
      price: Number(defaultValues.price),
      product_category_id: defaultValues.product_category_id?.toString() || "",
      tax_id: defaultValues.tax_id?.toString() || "",
    } : {
      name: "",
      sku: "",
      description: "",
      price: 0,
      product_category_id: "",
      tax_id: "",
    },
  })

  const categoryId = watch("product_category_id")
  const taxId = watch("tax_id")

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
        await queryClient.invalidateQueries({ queryKey: ["products"] })
        router.push('/products')
      } else if (productId) {
        await productsApi.update(productId, productData, accessToken)
        await queryClient.invalidateQueries({ queryKey: ["products"] })
        await queryClient.invalidateQueries({ queryKey: ["product", productId] })
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
          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Ingresa la descripción del producto" rows={4} {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Precio <span className="text-destructive">*</span>
              </Label>
              <Input id="price" type="number" min={0} step="0.01" placeholder="0.00" {...register("price")} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_category_id">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select
                value={categoryId || ""}
                onValueChange={(value) => setValue("product_category_id", value)}
                disabled={isLoadingCategories}
              >
                <SelectTrigger id="product_category_id">
                  <SelectValue placeholder={isLoadingCategories ? "Cargando..." : "Selecciona una categoría"} />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="tax_id">Impuesto</Label>
              <Select
                value={taxId || "none"}
                onValueChange={(value) => setValue("tax_id", value === "none" ? "" : value)}
                disabled={isLoadingTaxes}
              >
                <SelectTrigger id="tax_id">
                  <SelectValue placeholder={isLoadingTaxes ? "Cargando..." : "Selecciona un impuesto"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin impuesto</SelectItem>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.id} value={tax.id.toString()}>
                      {tax.name} ({tax.percentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </CardContent>
      </Card>


      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting} asChild>
          <Link href={`/products`}>
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
