"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Minus, RefreshCw } from "lucide-react"

interface StockAdjustmentFormProps {
  product: {
    id: string
    productName: string
    sku: string
    currentStock: number
  }
}

export function StockAdjustmentForm({ product }: StockAdjustmentFormProps) {
  return (
    <form className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="text-sm font-medium">Current Stock</p>
        <p className="mt-1 text-2xl font-bold">{product.currentStock} units</p>
      </div>

      <div className="space-y-3">
        <Label>Adjustment Type</Label>
        <RadioGroup defaultValue="add" className="grid grid-cols-3 gap-3">
          <div>
            <RadioGroupItem value="add" id="add" className="peer sr-only" />
            <Label
              htmlFor="add"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Plus className="mb-2 h-5 w-5" />
              <span className="text-sm font-medium">Add Stock</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="remove" id="remove" className="peer sr-only" />
            <Label
              htmlFor="remove"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <Minus className="mb-2 h-5 w-5" />
              <span className="text-sm font-medium">Remove</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="adjust" id="adjust" className="peer sr-only" />
            <Label
              htmlFor="adjust"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <RefreshCw className="mb-2 h-5 w-5" />
              <span className="text-sm font-medium">Adjust</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" placeholder="Enter quantity" min="1" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" placeholder="Enter reason for adjustment" rows={3} required />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Confirm Adjustment</Button>
      </div>
    </form>
  )
}
