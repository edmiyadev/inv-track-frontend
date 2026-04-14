import { PageHeader } from "@/components/layout/page-header"
import { StockHistoryTimeline } from "@/components/inventory/stock-history-timeline"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function InventoryHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Historial de Movimientos"
        description="Ver todas las transacciones y ajustes del inventario"
      />

      <StockHistoryTimeline />
    </div>
  )
}
