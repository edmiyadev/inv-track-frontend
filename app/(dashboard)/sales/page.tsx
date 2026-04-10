import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SalesInvoiceTable } from "@/components/sales/sales-invoice-table"

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        description="Gestiona órdenes de venta, clientes y facturas"
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/sales/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden de Venta
              </Link>
            </Button>
          </div>

        }
      />


      <SalesInvoiceTable />
    </div>
  )
}
