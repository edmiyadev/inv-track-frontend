import { PageHeader } from "@/components/layout/page-header"
import { TaxForm } from "@/components/taxes/tax-form"

export default function NewTaxPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nuevo Impuesto"
        description="Configura un nuevo impuesto para el sistema"
      />
      <TaxForm />
    </div>
  )
}
