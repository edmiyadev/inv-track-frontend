"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store/auth"
import { taxesApi } from "@/lib/api/taxes"
import type { Tax } from "@/lib/api/types"

const taxSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
  percentage: z.coerce.number().min(0, "El porcentaje no puede ser negativo").max(100, "El porcentaje no puede ser mayor a 100"),
  description: z.string().max(500, "La descripción es muy larga").nullable().optional(),
  is_active: z.boolean().default(true),
})

type TaxFormData = z.infer<typeof taxSchema>

interface TaxFormProps {
  tax?: Tax
  taxId?: number
}

export function TaxForm({ tax, taxId }: TaxFormProps) {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isEditing = !!taxId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      name: "",
      percentage: 0,
      description: "",
      is_active: true,
    },
  })

  const isActive = watch("is_active")

  useEffect(() => {
    const loadTax = async () => {
      if (!taxId || !accessToken) return

      try {
        const response = await taxesApi.getById(taxId, accessToken)
        const taxData = response.data
        setValue("name", taxData.name)
        setValue("percentage", taxData.percentage)
        setValue("description", taxData.description || "")
        setValue("is_active", taxData.is_active)
      } catch (error) {
        console.error("Error loading tax:", error)
        alert("Error al cargar el impuesto")
      }
    }

    if (isEditing && !tax) {
      loadTax()
    } else if (tax) {
      setValue("name", tax.name)
      setValue("percentage", tax.percentage)
      setValue("description", tax.description || "")
      setValue("is_active", tax.is_active)
    }
  }, [taxId, tax, accessToken, isEditing, setValue])

  const onSubmit = async (data: TaxFormData) => {
    if (!accessToken) {
      alert("No estás autenticado")
      return
    }

    try {
      if (isEditing && taxId) {
        await taxesApi.update(taxId, data, accessToken)
        alert("Impuesto actualizado exitosamente")
      } else {
        await taxesApi.create(data, accessToken)
        alert("Impuesto creado exitosamente")
      }
      router.push("/taxes")
      router.refresh()
    } catch (error) {
      console.error("Error saving tax:", error)
      alert(isEditing ? "Error al actualizar el impuesto" : "Error al crear el impuesto")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Impuesto" : "Nuevo Impuesto"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Actualiza la información del impuesto" 
            : "Completa el formulario para crear un nuevo impuesto"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: ITBIS 18%"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Porcentaje */}
            <div className="space-y-2">
              <Label htmlFor="percentage">
                Porcentaje (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                placeholder="Ej: 18"
                {...register("percentage")}
                disabled={isSubmitting}
              />
              {errors.percentage && (
                <p className="text-sm text-destructive">{errors.percentage.message}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del impuesto..."
              className="resize-none"
              {...register("description")}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Estado Activo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="is_active">Impuesto activo</Label>
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
                : (isEditing ? "Actualizar Impuesto" : "Crear Impuesto")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/taxes")}
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
