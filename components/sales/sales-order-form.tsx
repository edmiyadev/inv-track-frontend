"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { salesOrderFormSchema, type SalesOrderFormData } from "@/lib/validations"
import type { SalesOrder, Customer, Product } from "@/types"

interface SalesOrderFormProps {
  order?: SalesOrder
  customers: Customer[]
  products: Product[]
  onSubmit: (data: SalesOrderFormData) => void
  onCancel: () => void
}

export function SalesOrderForm({ order, customers, products, onSubmit, onCancel }: SalesOrderFormProps) {
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
          customerId: order.customerId,
          orderDate: order.orderDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          items: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          discount: order.discount,
          notes: order.notes,
        }
      : {
          orderDate: new Date(),
          expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: [{ productId: "", quantity: 1, unitPrice: 0 }],
          discount: 0,
        },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const items = watch("items")
  const discount = watch("discount") || 0
  const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax - discount

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
              <Select value={watch("customerId")} onValueChange={(value) => setValue("customerId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive">{errors.customerId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderDate">
                Order Date <span className="text-destructive">*</span>
              </Label>
              <Input id="orderDate" type="date" {...register("orderDate", { valueAsDate: true })} />
              {errors.orderDate && <p className="text-sm text-destructive">{errors.orderDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">
                Expected Delivery <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                {...register("expectedDeliveryDate", { valueAsDate: true })}
              />
              {errors.expectedDeliveryDate && (
                <p className="text-sm text-destructive">{errors.expectedDeliveryDate.message}</p>
              )}
            </div>
          </div>
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
              <div className="flex-1 grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={watch(`items.${index}.productId`)}
                    onValueChange={(value) => {
                      setValue(`items.${index}.productId`, value)
                      const product = products.find((p) => p.id === value)
                      if (product) {
                        setValue(`items.${index}.unitPrice`, product.price)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
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
              </div>

              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {errors.items && <p className="text-sm text-destructive">{errors.items.message}</p>}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Discount:</span>
              <Input
                type="number"
                step="0.01"
                {...register("discount", { valueAsNumber: true })}
                className="w-32 h-8"
                min="0"
              />
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
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
