import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function NewPurchasingSupplierPage() {
  return (
    <ProtectedRoute action="create" subject="Supplier" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Nuevo Proveedor"
          description="Crea un nuevo proveedor para tu inventario"
        />
        <SupplierForm />
      </div>
    </ProtectedRoute>
  )
}
