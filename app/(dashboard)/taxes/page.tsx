import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { TaxTable } from "@/components/taxes/tax-table"

export default function TaxesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Impuestos"
        description="Gestiona los impuestos aplicables a tus productos y transacciones"
        actions={
          <Button asChild>
            <Link href="/taxes/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Impuesto
            </Link>
          </Button>
        }
      />

      <TaxTable />
    </div>
  )
}
