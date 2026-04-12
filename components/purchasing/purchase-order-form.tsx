"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { purchaseOrderFormSchema, type PurchaseOrderFormData } from "@/lib/validations"
import type { Purchase, Supplier, Product, Warehouse, Tax } from "@/lib/api/types"

interface PurchaseOrderFormProps {
  order?: Purchase
  suppliers: Supplier[]
  products: Product[]
  warehouses: Warehouse[]
  taxes: Tax[]
  totalPrice?: number
  onSubmit: (data: PurchaseOrderFormData) => Promise<void>
  onCancel: () => void
}

export function PurchaseOrderForm({ order, suppliers, products, warehouses, taxes, totalPrice, onSubmit, onCancel }: PurchaseOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: order
      ? {
        supplierId: order.supplier_id,
        warehouseId: order.warehouse_id || undefined,
        orderDate: new Date().toISOString().split("T")[0],
        items: order.items?.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price),
          taxId: item.tax_id ?? undefined,
          totalPrice: parseFloat(item.total_price),
        })) || [],
        notes: order.notes || "",
      }
      : {
        orderDate: new Date().toISOString().split("T")[0],
        items: [{ productId: 0, quantity: 1, unitPrice: 0, taxId: undefined, totalPrice: 0 }],
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

  const calculateLineTotal = (item: PurchaseOrderFormData["items"][number]) => {
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

  useEffect(() => {
    items.forEach((item, index) => {
      const lineTotal = calculateLineTotal(item)

      if ((item.totalPrice || 0) !== lineTotal) {
        setValue(`items.${index}.totalPrice`, lineTotal, {
          shouldDirty: false,
          shouldValidate: true,
        })
      }
    })
  }, [items, setValue, taxes])

  const handleFormSubmit = async (data: PurchaseOrderFormData) => {
    setIsSubmitting(true)
    try {
      const normalizedData: PurchaseOrderFormData = {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          totalPrice: calculateLineTotal(item),
        })),
      }

      await onSubmit(normalizedData)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Enter purchase order details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="supplierId">
                Supplier <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("supplierId")?.toString()}
                onValueChange={(value) => setValue("supplierId", parseInt(value))}
              >
                <SelectTrigger className="w-full" >
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplierId && <p className="text-sm text-destructive">{errors.supplierId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouseId">
                Warehouse <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("warehouseId")?.toString()}
                onValueChange={(value) => setValue("warehouseId", parseInt(value))}
              >
                <SelectTrigger className="w-full">
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
              <Input
                id="orderDate"
                type="date"
                {...register("orderDate")}
              />
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
          <CardDescription>Add products to this purchase order</CardDescription>
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
                    <SelectTrigger className="w-full">
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
                  {errors.items?.[index]?.productId && (
                    <p className="text-sm text-destructive">{errors.items[index]?.productId?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    min="1"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-sm text-destructive">{errors.items[index]?.quantity?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    min="0"
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="text-sm text-destructive">{errors.items[index]?.unitPrice?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tax</Label>
                  <Select
                    value={watch(`items.${index}.taxId`)?.toString()}
                    onValueChange={(value) => setValue(`items.${index}.taxId`, parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
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
                    value={calculateLineTotal(items[index] ?? { productId: 0, quantity: 0, unitPrice: 0, taxId: undefined, totalPrice: 0 })}
                    min="0"
                    readOnly
                  />
                  <input type="hidden" {...register(`items.${index}.totalPrice`, { valueAsNumber: true })} />
                  {errors.items?.[index]?.totalPrice && (
                    <p className="text-sm text-destructive">{errors.items[index]?.totalPrice?.message}</p>
                  )}
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
            onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0, taxId: undefined, totalPrice: 0 })}
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
              <span className="text-muted-foreground">Impuestos</span>
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
