import { PageHeader } from "@/components/layout/page-header"
import { StockTable } from "@/components/inventory/stock-table"
import { InventoryStats } from "@/components/inventory/inventory-stats"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Seguimiento de Inventario"
        description="Monitorea y gestiona los niveles de stock de todos los productos"
      />

      <InventoryStats />

      <StockTable />
    </div>
  )
}
