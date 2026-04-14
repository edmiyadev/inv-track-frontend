"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supplierFormSchema, type SupplierFormData } from "@/lib/validations"
import type { Supplier } from "@/lib/api/types"
import { Loader2 } from "lucide-react"

interface SupplierFormProps {
  supplier?: Supplier
  onSubmit: (data: SupplierFormData) => Promise<void>
  onCancel: () => void
}

export function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: supplier
      ? {
          name: supplier.name,
          rnc: supplier.rnc || "",
          email: supplier.email || "",
          phone_number: supplier.phone_number || "",
          address: supplier.address || "",
          is_active: supplier.is_active,
        }
      : {
          is_active: true,
        },
  })

  const handleFormSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Proveedor</CardTitle>
          <CardDescription>Ingresa la información básica del proveedor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Proveedor <span className="text-destructive">*</span>
              </Label>
              <Input id="name" {...register("name")} placeholder="Ingresa el nombre del proveedor" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rnc">RNC</Label>
              <Input id="rnc" {...register("rnc")} placeholder="Ingresa el RNC" />
              {errors.rnc && <p className="text-sm text-destructive">{errors.rnc.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" {...register("email")} placeholder="supplier@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Teléfono</Label>
              <Input id="phone_number" {...register("phone_number")} placeholder="+1 (555) 123-4567" />
              {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea id="address" {...register("address")} placeholder="Ingresa la dirección completa" rows={3} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Proveedor Activo</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {supplier ? "Actualizar Proveedor" : "Crear Proveedor"}
        </Button>
      </div>
    </form>
  )
}
