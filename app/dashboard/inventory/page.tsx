import { PageHeader } from "@/components/layout/page-header"
import { StockTable } from "@/components/inventory/stock-table"
import { InventoryStats } from "@/components/inventory/inventory-stats"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Seguimiento de Inventario"
        description="Monitorea y gestiona los niveles de stock de todos los productos"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar Datos
            </Button>
          </div>
        }
      />

      <InventoryStats />

      <StockTable />
    </div>
  )
}
