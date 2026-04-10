"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

export function ProductFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-end">
      <div className="flex-1">
        <Label htmlFor="search" className="text-sm font-medium">
          Buscar Productos
        </Label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="search" placeholder="Buscar por nombre o SKU..." className="pl-9" />
        </div>
      </div>

      <div className="w-full md:w-[200px]">
        <Label htmlFor="category" className="text-sm font-medium">
          Categoría
        </Label>
        <Select defaultValue="all">
          <SelectTrigger id="category" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {PRODUCT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
