"use client"

import { use } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { CustomerForm } from "@/components/sales/customer-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <ProtectedRoute action="edit" subject="Customer" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Editar Cliente"
          description="Actualiza la información del cliente"
        />
        <CustomerForm customerId={parseInt(resolvedParams.id)} />
      </div>
    </ProtectedRoute>
  )
}
