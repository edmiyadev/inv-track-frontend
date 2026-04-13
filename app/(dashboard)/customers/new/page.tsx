import { PageHeader } from "@/components/layout/page-header"
import { CustomerForm } from "@/components/sales/customer-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function NewCustomerPage() {
  return (
    <ProtectedRoute action="create" subject="Customer" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Nuevo Cliente"
          description="Crea un nuevo cliente para tu inventario"
        />
        <CustomerForm />
      </div>
    </ProtectedRoute>
  )
}
