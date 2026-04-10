import { PageHeader } from "@/components/layout/page-header"
import { CustomerForm } from "@/components/sales/customer-form"

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nuevo Cliente"
        description="Crea un nuevo cliente para tu inventario"
      />
      <CustomerForm />
    </div>
  )
}
