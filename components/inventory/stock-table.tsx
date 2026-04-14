"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StockAdjustmentForm } from "./stock-adjustment-form"
import { useQuery } from "@tanstack/react-query"
import { inventoryApi } from "@/lib/api/inventory"
import { useAuthStore } from "@/lib/store/auth"
import { Stock } from "@/lib/api/types"

export function StockTable() {
  const { accessToken } = useAuthStore()
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)

  const { data: stockResponse, isLoading, error } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => inventoryApi.getAllStocks(accessToken!),
    enabled: !!accessToken,
  })

  const stocks = stockResponse?.data || []

  const getStatus = (stock: Stock) => {
    if (stock.quantity === 0) return "out-of-stock"
    if (stock.quantity <= stock.reorder_point) return "low-stock"
    return "in-stock"
  }

  const getStatusBadge = (stock: Stock) => {
    const status = getStatus(stock)
    const variants = {
      "in-stock": "default",
      "low-stock": "secondary",
      "out-of-stock": "destructive",
    } as const

    const labels = {
      "in-stock": "En Stock",
      "low-stock": "Stock Bajo",
      "out-of-stock": "Sin Stock",
    }

    return (
      <Badge variant={variants[status]} className="font-normal">
        {labels[status]}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card text-destructive">
        Error al cargar el inventario
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Producto
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Almacén</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Stock Actual
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Punto de Reorden</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell className="font-medium">{stock.product?.name || "Producto desconocido"}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{stock.product?.sku || "-"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{stock.warehouse?.name || "-"}</TableCell>
              <TableCell className="text-right font-semibold">{stock.quantity}</TableCell>
              <TableCell className="text-right text-muted-foreground">{stock.reorder_point}</TableCell>
              <TableCell>{getStatusBadge(stock)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(stock.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Dialog open={isAdjustmentOpen && selectedStock?.id === stock.id} onOpenChange={(open) => {
                  if (open) setSelectedStock(stock)
                  setIsAdjustmentOpen(open)
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Ajustar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajustar Stock</DialogTitle>
                      <DialogDescription>
                        Actualizar niveles de stock de {stock.product?.name} en {stock.warehouse?.name}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedStock && (
                      <StockAdjustmentForm 
                        stock={selectedStock} 
                        onSuccess={() => setIsAdjustmentOpen(false)} 
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {stocks.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron registros de stock.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

