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
          orderDate: new Date(order.date).toISOString().split("T")[0],
          items: order.items?.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unit_price),
            taxId: item.tax_id ?? undefined,
          })) || [],
          notes: order.notes || "",
        }
      : {
          orderDate: new Date().toISOString().split("T")[0],
          items: [{ productId: 0, quantity: 1, unitPrice: 0, taxId: undefined }],
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
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Enter sales order details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="customerId">
                Customer <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("customerId")?.toString()}
                onValueChange={(value) => setValue("customerId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
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
                Warehouse <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("warehouseId")?.toString()}
                onValueChange={(value) => setValue("warehouseId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
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
                Date <span className="text-destructive">*</span>
              </Label>
              <Input id="orderDate" type="date" {...register("orderDate")} />
              {errors.orderDate && <p className="text-sm text-destructive">{errors.orderDate.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register("notes")} placeholder="Enter any additional notes or instructions" rows={4} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Add products to this sales order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="flex-1 grid gap-4 md:grid-cols-[2fr_0.7fr_0.9fr_1.2fr_0.9fr]">
                <div className="space-y-2">
                  <Label>Product</Label>
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
                      <SelectValue placeholder="Select product" />
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
                  <Label>Quantity</Label>
                  <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} min="1" />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tax</Label>
                  <Select
                    value={watch(`items.${index}.taxId`)?.toString()}
                    onValueChange={(value) => setValue(`items.${index}.taxId`, parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxes.map((tax) => (
                        <SelectItem key={tax.id} value={tax.id.toString()}>
                          {tax.name} ({tax.percentage}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subtotal</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={calculateLineTotal(items[index] ?? { productId: 0, quantity: 0, unitPrice: 0, taxId: undefined })}
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
            onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0, taxId: undefined })}
            className="w-full"
          >
            + Add Item
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
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : order ? "Update Order" : "Create Order"}
        </Button>
      </div>
    </form>
  )
}
