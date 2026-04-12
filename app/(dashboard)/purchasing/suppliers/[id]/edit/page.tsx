"use client"

import { use } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/suppliers/supplier-form"

export default function EditPurchasingSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar Proveedor"
        description="Actualiza la información del proveedor"
      />
      <SupplierForm supplierId={parseInt(resolvedParams.id)} />
    </div>
  )
}
