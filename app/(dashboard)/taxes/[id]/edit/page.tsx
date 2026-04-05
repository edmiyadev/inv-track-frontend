"use client"

import { use } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { TaxForm } from "@/components/taxes/tax-form"

export default function EditTaxPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar Impuesto"
        description="Actualiza la información del impuesto"
      />
      <TaxForm taxId={parseInt(resolvedParams.id)} />
    </div>
  )
}
