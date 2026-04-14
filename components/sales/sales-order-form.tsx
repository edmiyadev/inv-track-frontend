"use client"

import { useMemo, useState } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { salesOrderFormSchema, type SalesOrderFormData } from "@/lib/validations"
import type { Sale, Customer, Product, Warehouse, Tax } from "@/lib/api/types"

interface SalesOrderFormProps {
  order?: Sale
  customers: Customer[]
  products: Product[]
  warehouses: Warehouse[]
  taxes: Tax[]
  onSubmit: (data: SalesOrderFormData) => Promise<void>
  onCancel: () => void
}

const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getInputDate = (value?: string | null) => {
  if (!value) return getTodayDate()
  return value.slice(0, 10)
}

export function SalesOrderForm({ order, customers, products, warehouses, taxes, onSubmit, onCancel }: SalesOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderFormSchema),
    defaultValues: order
      ? {
          customerId: order.customer_id,
          warehouseId: order.warehouse_id,
          orderDate: getInputDate(order.date),
          items: order.items?.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unit_price),
            taxId: item.tax_id ?? 0,
          })) || [],
          notes: order.notes || "",
        }
      : {
          orderDate: getTodayDate(),
          items: [{ productId: 0, quantity: 1, unitPrice: 0, taxId: 0 }],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const items = useWatch({ control, name: "items" }) ?? []

  const getTaxPercentage = (taxId?: number) => {
    if (!taxId) return 0
    return Number(taxes.find((tax) => tax.id === taxId)?.percentage ?? 0)
  }

  const calculateLineTotal = (item: SalesOrderFormData["items"][number]) => {
    const quantity = item.quantity || 0
    const unitPrice = item.unitPrice || 0
    const baseAmount = quantity * unitPrice
    const taxAmount = baseAmount * (getTaxPercentage(item.taxId) / 100)
    return Number((baseAmount + taxAmount).toFixed(2))
  }

  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const quantity = item.quantity || 0
        const unitPrice = item.unitPrice || 0
        const baseAmount = quantity * unitPrice
        const taxAmount = baseAmount * (getTaxPercentage(item.taxId) / 100)

        acc.subtotal += baseAmount
        acc.tax += taxAmount
        acc.total += baseAmount + taxAmount
        return acc
      },
      { subtotal: 0, tax: 0, total: 0 }
    )
  }, [items, taxes])

  const handleFormSubmit = async (data: SalesOrderFormData) => {
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
          <CardTitle>Información de la Orden</CardTitle>
          <CardDescription>Ingresa los detalles de la orden de venta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="customerId">
                Cliente <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("customerId")?.toString()}
                onValueChange={(value) => setValue("customerId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive">{errors.customerId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouseId">
                Almacén <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("warehouseId")?.toString()}
                onValueChange={(value) => setValue("warehouseId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar almacén" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.warehouseId && <p className="text-sm text-destructive">{errors.warehouseId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderDate">
                Fecha <span className="text-destructive">*</span>
              </Label>
              <Input id="orderDate" type="date" {...register("orderDate")} />
              {errors.orderDate && <p className="text-sm text-destructive">{errors.orderDate.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register("notes")} placeholder="Ingresa notas o instrucciones adicionales" rows={4} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artículos de la Orden</CardTitle>
          <CardDescription>Agrega productos a esta orden de venta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="flex-1 grid gap-4 md:grid-cols-[2fr_0.7fr_0.9fr_1.2fr_0.9fr]">
                <div className="space-y-2">
                  <Label>Producto</Label>
                  <Select
                    value={watch(`items.${index}.productId`)?.toString()}
                    onValueChange={(value) => {
                      const productId = parseInt(value)
                      setValue(`items.${index}.productId`, productId)
                      const product = products.find((p) => p.id === productId)
                      if (product) {
                        setValue(`items.${index}.unitPrice`, parseFloat(product.price))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} min="1" />
                </div>

                <div className="space-y-2">
                  <Label>Precio Unitario</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Impuesto</Label>
                  <Select
                    value={watch(`items.${index}.taxId`) && watch(`items.${index}.taxId`) > 0 ? watch(`items.${index}.taxId`)?.toString() : undefined}
                    onValueChange={(value) => setValue(`items.${index}.taxId`, parseInt(value), { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar impuesto" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxes.map((tax) => (
                        <SelectItem key={tax.id} value={tax.id.toString()}>
                          {tax.name} ({tax.percentage}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.items?.[index]?.taxId && (
                    <p className="text-sm text-destructive">{errors.items[index]?.taxId?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Subtotal</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculateLineTotal(items[index] ?? { productId: 0, quantity: 0, unitPrice: 0, taxId: 0 })}
                    min="0"
                    readOnly
                  />
                </div>
              </div>

              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-8 h-full">
                  ✕
                </Button>
              )}
            </div>
          ))}

          {errors.items && <p className="text-sm text-destructive">{errors.items.message}</p>}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0, taxId: 0 })}
            className="w-full"
          >
            + Agregar Artículo
          </Button>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impuestos:</span>
              <span className="font-medium">${summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${summary.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : order ? "Actualizar Orden" : "Crear Orden"}
        </Button>
      </div>
    </form>
  )
}
