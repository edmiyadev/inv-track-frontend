"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { customersApi } from "@/lib/api/customers"
import type { Customer } from "@/lib/api/types"

const customerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
  tax_id: z.string().max(50, "El RNC es muy largo").transform(val => val === "" ? null : val).nullable().optional(),
  phone_number: z.string().max(50, "El teléfono es muy largo").transform(val => val === "" ? null : val).nullable().optional(),
  email: z.string().transform(val => val === "" ? null : val).nullable().optional().refine(
    (val) => !val || z.string().email().safeParse(val).success,
    { message: "Email inválido" }
  )
})

type CustomerFormData = z.infer<typeof customerSchema>

interface CustomerFormProps {
  customer?: Customer
  customerId?: number
}

export function CustomerForm({ customer, customerId }: CustomerFormProps) {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const isEditing = !!customerId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      tax_id: "",
      phone_number: "",
      email: "",
    },
  })

  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId || !accessToken) return

      try {
        const response = await customersApi.getById(customerId, accessToken)
        const customerData = response.data
        setValue("name", customerData.name)
        setValue("tax_id", customerData.tax_id || "")
        setValue("phone_number", customerData.phone_number || "")
        setValue("email", customerData.email || "")
      } catch (error) {
        console.error("Error loading customer:", error)
        alert("Error al cargar el cliente")
      }
    }

    if (isEditing && !customer) {
      loadCustomer()
    } else if (customer) {
      setValue("name", customer.name)
      setValue("tax_id", customer.tax_id || "")
      setValue("phone_number", customer.phone_number || "")
      setValue("email", customer.email || "")
    }
  }, [customerId, customer, accessToken, isEditing, setValue])


  const onSubmit = async (data: CustomerFormData) => {
    if (!accessToken) {
      alert("No estás autenticado")
      return
    }

    try {
      if (isEditing && customerId) {
        await customersApi.update(customerId, data, accessToken)
        alert("Cliente actualizado exitosamente")
      } else {
        await customersApi.create(data, accessToken)
        alert("Cliente creado exitosamente")
      }
      router.push("/customers")
      router.refresh()
    } catch (error) {
      console.error("Error saving customer:", error)
      alert(isEditing ? "Error al actualizar el cliente" : "Error al crear el cliente")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualiza la información del cliente"
            : "Completa el formulario para crear un nuevo cliente"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Juan Pérez"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">
                Tax ID
              </Label>
              <Input
                id="tax_id"
                placeholder="Ej: 123456789"
                {...register("tax_id")}
                disabled={isSubmitting}
              />
              {errors.tax_id && (
                <p className="text-sm text-destructive">{errors.tax_id.message}</p>
              )}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ej: cliente@email.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting
                ? (isEditing ? "Actualizando..." : "Creando...")
                : (isEditing ? "Actualizar Cliente" : "Crear Cliente")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/customers")}
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
