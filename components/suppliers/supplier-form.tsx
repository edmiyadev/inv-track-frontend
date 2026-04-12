"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
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
import { suppliersApi } from "@/lib/api/suppliers"
import type { Supplier } from "@/lib/api/types"

const supplierSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
  rnc: z.string().max(50, "El RNC es muy largo").transform(val => val === "" ? null : val).nullable().optional(),
  phone_number: z.string().max(50, "El teléfono es muy largo").transform(val => val === "" ? null : val).nullable().optional(),
  email: z.string().transform(val => val === "" ? null : val).nullable().optional().refine(
    (val) => !val || z.string().email().safeParse(val).success,
    { message: "Email inválido" }
  ),
  address: z.string().transform(val => val === "" ? null : val).nullable().optional(),
  is_active: z.boolean().default(true),
})

type SupplierFormData = z.infer<typeof supplierSchema>

interface SupplierFormProps {
  supplier?: Supplier
  supplierId?: number
}

export function SupplierForm({ supplier, supplierId }: SupplierFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isEditing = !!supplierId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      rnc: "",
      phone_number: "",
      email: "",
      address: "",
      is_active: true,
    },
  })

  const isActive = watch("is_active")

  useEffect(() => {
    const loadSupplier = async () => {
      if (!supplierId || !accessToken) return

      try {
        const response = await suppliersApi.getById(supplierId, accessToken)
        const supplierData = response.data
        setValue("name", supplierData.name)
        setValue("rnc", supplierData.rnc || "")
        setValue("phone_number", supplierData.phone_number || "")
        setValue("email", supplierData.email || "")
        setValue("address", supplierData.address || "")
        setValue("is_active", supplierData.is_active)
      } catch (error) {
        console.error("Error loading supplier:", error)
        alert("Error al cargar el proveedor")
      }
    }

    if (isEditing && !supplier) {
      loadSupplier()
    } else if (supplier) {
      setValue("name", supplier.name)
      setValue("rnc", supplier.rnc || "")
      setValue("phone_number", supplier.phone_number || "")
      setValue("email", supplier.email || "")
      setValue("address", supplier.address || "")
      setValue("is_active", supplier.is_active)
    }
  }, [supplierId, supplier, accessToken, isEditing, setValue])

  const onSubmit = async (data: SupplierFormData) => {
    if (!accessToken) {
      alert("No estás autenticado")
      return
    }

    try {
      if (isEditing && supplierId) {
        await suppliersApi.update(supplierId, data, accessToken)
        alert("Proveedor actualizado exitosamente")
      } else {
        await suppliersApi.create(data, accessToken)
        alert("Proveedor creado exitosamente")
      }
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      router.push("/suppliers")
      router.refresh()
    } catch (error) {
      console.error("Error saving supplier:", error)
      alert(isEditing ? "Error al actualizar el proveedor" : "Error al crear el proveedor")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Actualiza la información del proveedor" 
            : "Completa el formulario para crear un nuevo proveedor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Distribuidora XYZ"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* RNC */}
            <div className="space-y-2">
              <Label htmlFor="rnc">
                RNC
              </Label>
              <Input
                id="rnc"
                placeholder="Ej: 12345678901"
                {...register("rnc")}
                disabled={isSubmitting}
              />
              {errors.rnc && (
                <p className="text-sm text-destructive">{errors.rnc.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone_number">
                Teléfono
              </Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="Ej: (809) 555-1234"
                {...register("phone_number")}
                disabled={isSubmitting}
              />
              {errors.phone_number && (
                <p className="text-sm text-destructive">{errors.phone_number.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ej: contacto@proveedor.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Dirección
            </Label>
            <Textarea
              id="address"
              placeholder="Ej: Calle Principal #123, Santo Domingo"
              rows={3}
              {...register("address")}
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
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
            <Label htmlFor="is_active" className="cursor-pointer">
              Proveedor activo
            </Label>
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
                : (isEditing ? "Actualizar Proveedor" : "Crear Proveedor")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/suppliers")}
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
