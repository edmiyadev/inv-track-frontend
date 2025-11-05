import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react"
import type { InventoryMovement } from "@/types"

const mockHistory: InventoryMovement[] = [
  {
    id: "1",
    productId: "1",
    productName: "Wireless Mouse",
    type: "in",
    quantity: 50,
    reason: "New shipment received",
    performedBy: "John Doe",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    productId: "2",
    productName: "USB-C Cable",
    type: "out",
    quantity: 25,
    reason: "Customer order fulfillment",
    performedBy: "Jane Smith",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    productId: "3",
    productName: "Mechanical Keyboard",
    type: "adjustment",
    quantity: 5,
    reason: "Inventory count correction",
    performedBy: "Admin",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "4",
    productId: "1",
    productName: "Wireless Mouse",
    type: "out",
    quantity: 15,
    reason: "Bulk order shipment",
    performedBy: "John Doe",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    productId: "4",
    productName: "Office Chair",
    type: "in",
    quantity: 10,
    reason: "Restocking",
    performedBy: "Jane Smith",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
]

export function StockHistoryTimeline() {
  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement History</CardTitle>
        <CardDescription>Recent inventory transactions and adjustments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-[17px] top-2 h-[calc(100%-2rem)] w-px bg-border" />

          {mockHistory.map((movement, index) => (
            <div key={movement.id} className="relative flex gap-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-background z-10 ${
                  movement.type === "in"
                    ? "bg-success text-success-foreground"
                    : movement.type === "out"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-warning text-warning-foreground"
                }`}
              >
                {movement.type === "in" ? (
                  <ArrowDownIcon className="h-4 w-4" />
                ) : movement.type === "out" ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium leading-none">{movement.productName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{movement.reason}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {movement.type === "in" ? "+" : movement.type === "out" ? "-" : "±"}
                    {movement.quantity}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{movement.performedBy}</span>
                  <span>•</span>
                  <span>{getTimeAgo(movement.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
