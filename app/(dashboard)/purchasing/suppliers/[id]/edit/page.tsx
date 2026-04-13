"use client"

import { use } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function EditPurchasingSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <ProtectedRoute action="edit" subject="Supplier" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Editar Proveedor"
          description="Actualiza la información del proveedor"
        />
        <SupplierForm supplierId={parseInt(resolvedParams.id)} />
      </div>
    </ProtectedRoute>
  )
}
