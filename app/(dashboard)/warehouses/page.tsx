import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { WarehouseTable } from "@/components/warehouses/warehouse-table"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CanAccess } from "@/components/auth/can-access"

export default function WarehousesPage() {
  return (
    // <ProtectedRoute action="view" subject="Warehouse" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Almacenes"
          description="Gestiona los almacenes y ubicaciones de inventario"
          actions={
            // <CanAccess action="create" subject="Warehouse">
              <Button asChild>
                <Link href="/warehouses/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Almacén
                </Link>
              </Button>
            // </CanAccess>
          }
        />

        <WarehouseTable />
      </div>
    // </ProtectedRoute>
  )
}
