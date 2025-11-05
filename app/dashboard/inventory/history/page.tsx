import { PageHeader } from "@/components/layout/page-header"
import { StockHistoryTimeline } from "@/components/inventory/stock-history-timeline"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function InventoryHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movement History"
        description="View all inventory transactions and adjustments"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        }
      />

      <StockHistoryTimeline />
    </div>
  )
}
