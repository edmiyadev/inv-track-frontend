"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, AlertTriangle, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { inventoryApi } from "@/lib/api/inventory"
import { useAuthStore } from "@/lib/store/auth"

export function InventoryStats() {
  const { accessToken } = useAuthStore()

  const { data: stocksResponse, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => inventoryApi.getAllStocks(accessToken!),
    enabled: !!accessToken,
  })

  const stocks = stocksResponse?.data || []
  
  const totalItems = stocks.reduce((acc, stock) => acc + stock.quantity, 0)
  const lowStockCount = stocks.filter(stock => stock.quantity <= stock.reorder_point).length

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">Unidades en todos los almacenes</p>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock In (Today)</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">-</div>
          <p className="text-xs text-muted-foreground">Not available yet</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Out (Today)</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">-</div>
          <p className="text-xs text-muted-foreground">Not available yet</p>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground">Productos por debajo del punto de reorden</p>
        </CardContent>
      </Card>
    </div>
  )
}
