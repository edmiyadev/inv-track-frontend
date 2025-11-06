"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store/auth"
import { categoriesApi } from "@/lib/api/categories"
import type { ProductCategory } from "@/lib/api/types"

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: ProductCategory
  categoryId?: number
}

export function CategoryForm({ category, categoryId }: CategoryFormProps) {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isEditing = !!categoryId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId || !accessToken) return

      try {
        const response = await categoriesApi.getById(categoryId, accessToken)
        const categoryData = response.data
        setValue("name", categoryData.name)
      } catch (error) {
        console.error("Error loading category:", error)
        alert("Error al cargar la categoría")
      }
    }

    if (isEditing && !category) {
      loadCategory()
    } else if (category) {
      setValue("name", category.name)
    }
  }, [categoryId, category, accessToken, isEditing, setValue])

  const onSubmit = async (data: CategoryFormData) => {
    if (!accessToken) {
      alert("No estás autenticado")
      return
    }

    try {
      if (isEditing && categoryId) {
        await categoriesApi.update(categoryId, data, accessToken)
        alert("Categoría actualizada exitosamente")
      } else {
        await categoriesApi.create(data, accessToken)
        alert("Categoría creada exitosamente")
      }
      router.push("/dashboard/categories")
      router.refresh()
    } catch (error) {
      console.error("Error saving category:", error)
      alert(isEditing ? "Error al actualizar la categoría" : "Error al crear la categoría")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Actualiza la información de la categoría" 
            : "Completa el formulario para crear una nueva categoría"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ej: Ropa y Calzado"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting 
                ? (isEditing ? "Actualizando..." : "Creando...") 
                : (isEditing ? "Actualizar Categoría" : "Crear Categoría")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/categories")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
