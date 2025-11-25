import { PageHeader } from "@/components/layout/page-header"
import { WarehouseForm } from "@/components/warehouses/warehouse-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function NewWarehousePage() {
  return (
    // <ProtectedRoute action="create" subject="Warehouse" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Nuevo Almacén"
          description="Crea un nuevo almacén para gestionar tu inventario"
        />
          <WarehouseForm />
      </div>
    // </ProtectedRoute>
  )
}
