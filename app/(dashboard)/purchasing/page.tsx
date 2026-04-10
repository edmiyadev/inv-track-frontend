import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PurchaseOrderTable } from "@/components/purchasing/purchase-order-table"

export default function PurchasingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Compras"
        description="Gestiona órdenes de compra, proveedores y facturas"
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/purchasing/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden de Compra
              </Link>
            </Button>
          </div>
        }
      />

      <PurchaseOrderTable />
    </div>
  )
}
