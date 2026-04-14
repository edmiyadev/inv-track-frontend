import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

const lowStockItems = [
  { id: 1, name: "USB-C Cable", sku: "USB-001", current: 5, reorder: 20 },
  { id: 2, name: "Wireless Mouse", sku: "MSE-002", current: 8, reorder: 15 },
  { id: 3, name: "HDMI Cable", sku: "HDM-003", current: 3, reorder: 25 },
  { id: 4, name: "Laptop Stand", sku: "STD-004", current: 2, reorder: 10 },
]

export function LowStockAlert() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas de Stock Bajo
            </CardTitle>
            <CardDescription>Productos por debajo del punto de reorden</CardDescription>
          </div>
          <Badge variant="destructive">{lowStockItems.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-destructive">{item.current} unidades</p>
                <p className="text-xs text-muted-foreground">Reorden: {item.reorder}</p>
              </div>
            </div>
          ))}
          <Button asChild className="w-full bg-transparent" variant="outline">
            <Link href="/inventory">Ver Todo el Inventario</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
