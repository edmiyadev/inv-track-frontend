"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store/auth"
import { warehousesApi } from "@/lib/api/warehouses"
import type { Warehouse } from "@/lib/api/types"
import { toast } from "sonner"

const warehouseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
  code: z.string().min(1, "El código es requerido").max(50, "El código es muy largo"),
  description: z.string().max(500, "La descripción es muy larga").optional().nullable(),
  location: z.string().max(255, "La ubicación es muy larga").optional().nullable(),
})

type WarehouseFormData = z.infer<typeof warehouseSchema>

interface WarehouseFormProps {
  warehouse?: Warehouse
  warehouseId?: number
}

export function WarehouseForm({ warehouse, warehouseId }: WarehouseFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isEditing = !!warehouseId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: warehouse?.name || "",
      code: warehouse?.code || "",
      description: warehouse?.description || "",
      location: warehouse?.location || "",
    },
  })

  const onSubmit = async (data: WarehouseFormData) => {
    if (!accessToken) return

    try {
      if (isEditing && warehouseId) {
        await warehousesApi.update(warehouseId, data, accessToken)
        toast.success("Almacén actualizado correctamente")
      } else {
        await warehousesApi.create(data, accessToken)
        toast.success("Almacén creado correctamente")
      }
      await queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      router.push("/warehouses")
      router.refresh()
    } catch (error) {
      console.error("Error saving warehouse:", error)
      toast.error("Error al guardar el almacén")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Almacén" : "Nuevo Almacén"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualiza la información del almacén existente"
            : "Ingresa la información para crear un nuevo almacén"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Ej: Almacén Principal" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" placeholder="Ej: ALM-001" {...register("code")} />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" placeholder="Ej: Calle Principal #123" {...register("location")} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción opcional del almacén"
              className="min-h-[100px]"
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
