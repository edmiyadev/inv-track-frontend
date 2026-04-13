import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PurchaseOrderTable } from "@/components/purchasing/purchase-order-table"
import { CanAccess } from "@/components/auth/can-access"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PurchasingPage() {
  return (
    <ProtectedRoute action="view" subject="Purchase" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Compras"
          description="Gestiona órdenes de compra, proveedores y facturas"
          actions={
            <CanAccess action="create" subject="Purchase">
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/purchasing/orders/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Orden de Compra
                  </Link>
                </Button>
              </div>
            </CanAccess>
          }
        />

        <PurchaseOrderTable />
      </div>
    </ProtectedRoute>
  )
}
