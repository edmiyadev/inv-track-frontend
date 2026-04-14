"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownIcon, ArrowUpIcon, RefreshCw, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { inventoryApi } from "@/lib/api/inventory"
import { useAuthStore } from "@/lib/store/auth"
import type { Movement, MovementItem } from "@/lib/api/types"

export function StockHistoryTimeline() {
  const { accessToken } = useAuthStore()

  const { data: movementsResponse, isLoading } = useQuery({
    queryKey: ["movements"],
    queryFn: () => inventoryApi.getAllMovements(accessToken!, 1, 10), // Fetch latest 10
    enabled: !!accessToken,
  })

  // Handle both paginated (data.data) and simple array (data) responses
  const movements: Movement[] = movementsResponse?.data?.data || []

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return "Hace un momento"
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`
    const days = Math.floor(hours / 24)
    return `Hace ${days} día${days > 1 ? "s" : ""}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>Transacciones y ajustes recientes del inventario</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  // Flatten movements to items for display
  const historyItems = movements.flatMap((movement: Movement) =>
    (movement.items || []).map((item: MovementItem) => ({
      id: `${movement.id}-${item.id}`,
      productName: item.product?.name || "Producto desconocido",
      type: movement.movement_type,
      quantity: item.quantity,
      reason: movement.notes || "No notes",
      performedBy: movement.user?.name || "Unknown User",
      timestamp: movement.created_at,
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10) // Limit to 10 items

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Movimientos</CardTitle>
        <CardDescription>Transacciones y ajustes recientes del inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-[17px] top-2 h-[calc(100%-2rem)] w-px bg-border" />

          {historyItems.map((item) => (
            <div key={item.id} className="relative flex gap-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-background z-10 ${item.type === "in"
                    ? "bg-success text-success-foreground"
                    : item.type === "out"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-warning text-warning-foreground"
                  }`}
              >
                {item.type === "in" ? (
                  <ArrowDownIcon className="h-4 w-4" />
                ) : item.type === "out" ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium leading-none">{item.productName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.type === "in" ? "Recibido" : item.type === "out" ? "Enviado" : "Ajustado"}{" "}
                      <span className="font-medium text-foreground">{Math.abs(item.quantity)}</span> unidades
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {getTimeAgo(item.timestamp)}
                  </span>
                </div>
                {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] h-5">
                    {item.reason}
                  </Badge>
                  <span>by {item.performedBy}</span>
                </div> */}
              </div>
            </div>
          ))}

          {historyItems.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No se encontraron movimientos.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
