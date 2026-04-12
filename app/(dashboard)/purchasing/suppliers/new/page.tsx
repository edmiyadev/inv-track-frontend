import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/suppliers/supplier-form"

export default function NewPurchasingSupplierPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nuevo Proveedor"
        description="Crea un nuevo proveedor para tu inventario"
      />
      <SupplierForm />
    </div>
  )
}
