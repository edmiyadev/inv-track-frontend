"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Minus, RefreshCw, Loader2 } from "lucide-react"
import { Stock } from "@/lib/api/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { inventoryApi } from "@/lib/api/inventory"
import { useAuthStore } from "@/lib/store/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  type: z.enum(["add", "remove", "adjust"]),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1"),
  reason: z.string().min(1, "El motivo es obligatorio"),
})

type FormData = z.infer<typeof formSchema>

interface StockAdjustmentFormProps {
  stock: Stock
  onSuccess?: () => void
}

export function StockAdjustmentForm({ stock, onSuccess }: StockAdjustmentFormProps) {
  const { accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "add",
      quantity: 1,
      reason: "",
    },
  })

  const adjustmentType = watch("type")

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      let quantity = data.quantity
      
      if (data.type === "remove") {
        quantity = -data.quantity
      } else if (data.type === "adjust") {
        // If "adjust" means "set to", we calculate the difference
        // But the input says "Quantity", so maybe "adjust" is just another word for correction?
        // Let's assume "adjust" in this UI context means "Set absolute value"
        // So if current is 10, and I enter 15, diff is +5.
        quantity = data.quantity - stock.quantity
      }

      // If quantity is 0, no movement needed
      if (quantity === 0) return

      return inventoryApi.createMovement({
        movement_type: "adjustment",
        origin_warehouse_id: stock.warehouse_id,
        notes: data.reason,
        items: [
          {
            product_id: stock.product_id,
            quantity: quantity,
          },
        ],
      }, accessToken!)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] })
      queryClient.invalidateQueries({ queryKey: ["movements"] })
      onSuccess?.()
    },
    onError: (err: any) => {
      setError(err.message || "Error al crear el ajuste")
    },
  })

  const onSubmit = (data: FormData) => {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="text-sm font-medium">Stock Actual</p>
        <p className="mt-1 text-2xl font-bold">{stock.quantity} unidades</p>
      </div>

      <div className="space-y-3">
        <Label>Tipo de Ajuste</Label>
        <RadioGroup 
          defaultValue="add" 
          className="grid grid-cols-3 gap-3"
          onValueChange={(val) => setValue("type", val as "add" | "remove" | "adjust")}
        >
          <div>
            <RadioGroupItem value="add" id="add" className="peer sr-only" />
            <Label
              htmlFor="add"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Plus className="mb-2 h-5 w-5" />
              <span className="text-sm font-medium">Agregar</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="remove" id="remove" className="peer sr-only" />
            <Label
              htmlFor="remove"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Minus className="mb-2 h-5 w-5" />
              <span className="text-sm font-medium">Retirar</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="adjust" id="adjust" className="peer sr-only" />
            <Label
              htmlFor="adjust"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <RefreshCw className="mb-2 h-5 w-5" />
              <span className="text-sm font-medium">Establecer Total</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">
          {adjustmentType === "adjust" ? "Nuevo Total de Stock" : "Cantidad"}
        </Label>
        <Input 
          id="quantity" 
          type="number" 
          placeholder="Ingresa la cantidad"
          min="0" 
          {...register("quantity")}
        />
        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo</Label>
        <Textarea
          id="reason"
          placeholder="Ingresa el motivo del ajuste"
          rows={3} 
          {...register("reason")}
        />
        {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar Ajuste
        </Button>
      </div>
    </form>
  )
}
